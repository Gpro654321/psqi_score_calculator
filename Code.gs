function getSheetId(){
  // returns the sheet id from the script property
  var sp = PropertiesService.getScriptProperties().getProperty('sheet_id');
  Logger.log(sp)
  return(sp)
}

function getSheetName(){
  // returns the sheet name from the script property
  var sn = PropertiesService.getScriptProperties().getProperty('sheet_name');
  Logger.log(sn)
  return(sn)
}

function collectData(sheet_id,sheet_name,row) {
  // collect data from a row of the specified spreadsheet and the sheet
  var ss = SpreadsheetApp.openById(sheet_id);
  var sheet = ss.getSheetByName(sheet_name);
  var range = sheet.getRange(row,1,1,23)
  var values = range.getValues()[0];
  
  return (values)

}

function convertToJson(row_array){
  // convert the given data to json
  
  // create empty object
  var object = {}

  // Iterate over the array and add each element to the object as a property.
  for (var i = 0; i < row_array.length; i++) {
    object[i] = row_array[i];
  }

  // Convert the object to JSON using the JSON.stringify() method.
  var json_data = JSON.stringify(object);

  return json_data;
}

function C1_score(row_array){
  // if column 23 is Very Good score is 0
  // if column 23 is Fairly good score is 1
  // if column 23 is Fairly bad score is 2
  // if column 23 is Very bad score is 3
  var score
  if (row_array[22] == "Very Good"){
    score = 0;
  }
  if (row_array[22] == "Fairly good"){
    score = 1;
  }
  if (row_array[22] == "Fairly bad"){
    score = 2;
  }
  if (row_array[22] == "Very bad"){
    score = 3;
  }
  return(score);
}

function C2_score(row_array){
  var score;
  var sum_score = C2_part1(row_array) + C2_part2(row_array)

  if (sum_score == 0) {
    score = 0
  }
  if (sum_score >= 1 && sum_score <= 2) {
    score = 1
  }
  if (sum_score >= 3 && sum_score <= 4) {
    score = 2
  }
  if (sum_score >= 5 && sum_score <= 6) {
    score = 3
  }
  console.log("C2_socre is ", score)
  return score
}


function C2_part1(row_array){
  // if <= 15 score is 0
  // if 16 - 30 min score is 1
  // if 31 to 60 score is 2
  // if > 60 socre is 3
  var score;
  Logger.log(row_array[6])
  var time_to_sleep = parseInt(row_array[6])
  Logger.log("time to sleep")
  Logger.log(time_to_sleep)

  if (time_to_sleep <= 15) {
    Logger.log("less than 15")
    score = 0
  }
  if (16 <= time_to_sleep  && time_to_sleep <= 30) {
    Logger.log("16-30")
    score = 1
  }
  if (31 <= time_to_sleep && time_to_sleep <= 60) {
    Logger.log('31-60')
    score = 2
  }
  if (time_to_sleep > 60) {
    Logger.log('>60')
    score  = 3
  }
  console.log("C2 part 1 score is ",score)
  return score
}

function C2_part2(row_array){
  var sleep_within_30_min = row_array[9]
  console.log("c2 part 2 score is ", past_month_score(sleep_within_30_min))
  return past_month_score(sleep_within_30_min)
}

function C3_score(row_array){
  var hours_of_sleep_at_night = row_array[8]
  var score

  if (hours_of_sleep_at_night >= 7) {
    score = 0
  }
  if (hours_of_sleep_at_night < 7 && hours_of_sleep_at_night >= 6) {
    score = 1
  }
  if (hours_of_sleep_at_night < 6 && hours_of_sleep_at_night >= 5) {
    score = 2
  }
  if (hours_of_sleep_at_night < 5) {
    score = 3
  }
  console.log("C3 score is ", score)
  return score
}

function C4_score(row_array){
  console.log("Inside C4_score")
  var hours_of_sleep = row_array[8]
  var hours_on_bed = hours_in_bed(row_array)

  var score

  var percentage_sleep_vs_bed_time = parseFloat((hours_of_sleep * 100)/hours_on_bed)
  console.log("% sleepVsBedTime ", percentage_sleep_vs_bed_time)

  if (percentage_sleep_vs_bed_time >= 85) {
    score = 0
  }
  if (percentage_sleep_vs_bed_time >= 75 && percentage_sleep_vs_bed_time < 85) {
    score = 1
  }
  if (percentage_sleep_vs_bed_time >= 65 && percentage_sleep_vs_bed_time < 75) {
    score = 2
  }
  if (percentage_sleep_vs_bed_time < 65) {
    score = 3
  }
  console.log("C4_score is ", score)
  return score
}

function hours_in_bed(row_array){
  // find if the bed_time is after 1200 hrs or before it
  var hours_in_bed
  var bed_time = row_array[5].getHours()
  console.log("bed_time hours is ", bed_time)

  // if the bed_time hours is > 12 (ie after 12 Noon), then first calculate the difference between this time and 2400 hours,
  // then add this difference to teh difference between 2400 hrs and wake up time
  if (bed_time >= 12){
    hours_in_bed = sleep_before_midnight(row_array[5], row_array[7])

  }

  // if the bed_time is < 12 hours (ie early in the morning), then calucate the difference bw this time and wake up time straight
  if (bed_time < 12) {
    hours_in_bed = sleep_early_morning(row_array[5], row_array[7])
  }
  // note that if a person sleeps from 1100hrs today to early morning 0200 hrs next day is not taken into account as it is quite rare
  // also note that if a person sleep from 1201 hrs and wakes up 2359 hrs, that also is not account for
  console.log("hours in bed", hours_in_bed)
  return hours_in_bed
}

function sleep_before_midnight(bed_time, wake_up_time) {
  console.log("Inside sleep_before_midnight")

  // part 1 caluclating difference between bed_time and 2400 hrs
  var bed_time_hours = bed_time.getHours()
  var bed_time_minutes = bed_time.getMinutes()

  // calulate the difference between 2400 hours and hte bed_time hours
  var bed_time_diff_hours = 24 - bed_time_hours

  // convert the hours to minutes - first calculate how many hours have passed, 
  // convet that into minutes aand then substract the minutes that was there in bed time
  var bed_time_diff_hours_to_min = (bed_time_diff_hours * 60) - bed_time_minutes

  // now again convert it back to hours
  var total_diff_1 = parseFloat(bed_time_diff_hours_to_min / 60)

  
  
  // part 2 calulating difference between 2400 hrs and wake_up time
  // simple and straight forward, waake up hours will be hours and minutws after conversion to hours will be added to the previous hours.
  var wake_up_time_hours = wake_up_time.getHours()
  var wake_up_time_minutes = wake_up_time.getMinutes()
  var min_to_hours = parseFloat(wake_up_time_minutes) / 60

  var total_diff_2 = wake_up_time_hours + min_to_hours

  var total_hours_in_bed = total_diff_1 + total_diff_2

  return total_hours_in_bed


}

function sleep_early_morning(bed_time, wake_up_time) {
  console.log("sleep_early_moring")
  var bed_time_hours = bed_time.getHours()
  var bed_time_minutes = bed_time.getMinutes()

  

  var wake_up_time_hours = wake_up_time.getHours()
  var wake_up_time_minutes = wake_up_time.getMinutes()

  // calculate how many minutes are there from 0000 hours for the bed time
  var time_elapsed_midnight_to_bed_time_minutes = ( bed_time_hours * 60 ) + bed_time_minutes

  // calculate how many minutes have elapsed since 0000 till time to wake up
  var time_elapsed_midnight_to_wake_up_time_minutes = (wake_up_time_hours * 60) + wake_up_time_minutes

  var time_diff_min = time_elapsed_midnight_to_wake_up_time_minutes - time_elapsed_midnight_to_bed_time_minutes

  var time_diff_hours = parseFloat(time_diff_min/60)

  return time_diff_hours

}

function past_month_score(answer) {
  var score;
  if (answer == "Not During The Past Month"){
    score = 0
  }
  if (answer == "Less Than Once A Week"){
    score = 1
  }
  if (answer == "Once Or Twice A Week") {
    score = 2
  }
  if (answer == "Three Or More Times A Week") {
    score = 3
  }
  return score
}

function C5_score(row_array) {
  console.log("Inside C5_score")
  var sum_score = 0;
  var score;
  var i;
  for (i=10; i<=18; i++) {
    console.log("past month score for i", i, past_month_score(row_array[i]))
    sum_score = sum_score + past_month_score(row_array[i])
  }
  console.log("C5 sum_score is ", sum_score)

  if (sum_score == 0) {
    score = 0
  }
  if (sum_score >=1 && sum_score < 10) {
    score = 1
  }
  if (sum_score >= 10 && sum_score < 19) {
    score = 2
  }
  if (sum_score >= 19 && sum_score <= 27) {
    score = 3
  }

  console.log("c5 score is ", score)
  return score
}

function C6_score(row_array) {
  console.log("Inside C6_score")
  var c6_score = past_month_score(row_array[19])

  console.log("The c6_score is ", c6_score)
  return c6_score

}

function C7_score(row_array) {
  console.log("Inside C7 score")
  var score;

  var c7_score_1 = past_month_score(row_array[20])
  var c7_score_2 = past_month_score(row_array[21])

  var c7_score_sum = c7_score_1 + c7_score_2
  console.log("C7 score sum is ", c7_score_sum)

  if (c7_score_sum == 0) {
    score = 0
  }
  if (c7_score_sum >= 1 && c7_score_sum <= 2) {
    score = 1
  }
  if (c7_score_sum >= 3 && c7_score_sum <= 4) {
    score = 2
  }
  if (c7_score_sum >= 5 && c7_score_sum <= 6) {
    score = 3
  }
  console.log("c7 score is ", score)
  return score
}

function score_array_generator(row_array) {
  console.log("Inside score_array_generator")
  var score_array = []
  score_array.push(C1_score(row_array))
  score_array.push(C2_score(row_array))
  score_array.push(C3_score(row_array))
  score_array.push(C4_score(row_array))
  score_array.push(C5_score(row_array))
  score_array.push(C6_score(row_array))
  score_array.push(C7_score(row_array))
  
  console.log("Behold the score_array ", score_array)

  var global_psqi = 0
  var i
  for(i=0;i<score_array.length; i++) {
    global_psqi = global_psqi + score_array[i];
  }
  console.log("The global psqi is ", global_psqi)
  
  score_array.push(global_psqi)
  console.log(score_array)
  return (score_array)
}

function set_score_array_in_sheet(sheet_id, sheet_name, score_array,row_number) {
  console.log("Inside set score array in sheet")

  var ss = SpreadsheetApp.openById(sheet_id);
  var sheet = ss.getSheetByName(sheet_name);
  var range = sheet.getRange(row_number,24,1,8)

  range.setValues([score_array])
  

}


function to_run_on_form_submission() {
  console.log("Inside to run on form submission")

  // this function runs whenever a form is submitted
  
  var sheet_id = getSheetId()
  var sheet_name = getSheetName()
  var last_row = SpreadsheetApp.openById(sheet_id).getSheetByName(sheet_name).getLastRow()
  var score_array = score_array_generator(collectData(sheet_id, sheet_name, last_row))

  set_score_array_in_sheet(sheet_id,sheet_name, score_array, last_row)
}

function sendAndReceiveDataToWebService(){
  // send and receive data to the web service
}
