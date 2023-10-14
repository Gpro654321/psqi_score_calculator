function test_collectData() {
  data = collectData(getSheetId(), getSheetName(),2);
  Logger.log(data)
}

function test_convertToJson(){
  var row_array = collectData(getSheetId(), getSheetName(),2)
  var json_data = convertToJson(row_array)
  Logger.log(json_data)
}

function test_C1_score(){
  c1_score = C1_score(collectData(getSheetId(), getSheetName(),2))
  Logger.log(c1_score);
}

function test_C2_part1(){
  var c2_score_part1 = C2_part1(collectData(getSheetId(), getSheetName(),2))
  Logger.log(c2_score_part1)
}

function test_C2_part2(){
  var c2_part2 = C2_part2(collectData(getSheetId(), getSheetName(),2))
  Logger.log(c2_part2)
}

function test_C2_score() {
  var c2_score = C2_score(collectData(getSheetId(), getSheetName(),2))
  Logger.log(c2_score)
}

function test_C3_score() {
  var c3_score = C3_score(collectData(getSheetId(), getSheetName(),2))
}

function test_hours_in_bed() {
  var bed_hours = hours_in_bed(collectData(getSheetId(), getSheetName(),2))

}

function test_C4_score() {
  var c4_score = C4_score(collectData(getSheetId(), getSheetName(),2))
}

function test_C5_score() {
  var c5_score = C5_score(collectData(getSheetId(), getSheetName(),2))
}

function test_C6_score() {
  var c6_score = C6_score(collectData(getSheetId(), getSheetName(),2))
}

function test_C7_score() {
  var c7_score = C7_score(collectData(getSheetId(), getSheetName(),2))
}

function test_score_array_generator() {
  var score_array = score_array_generator(collectData(getSheetId(), getSheetName(),2))
}

function test_set_score_array_in_sheet() {
  var score_array = score_array_generator(collectData(getSheetId(), getSheetName(),2))
  set_score_array_in_sheet(getSheetId(), getSheetName(), score_array,2)
  console.log("completed")
}

function test_log(){
  var a = 1
  var b = 2
  console.log("This is ", a, b)
}

function test_time() {
  var row_array = collectData(getSheetId(), getSheetName(),2)

  // if the person had slept in night
  var bed_time_hours = row_array[5].getHours()
  var bed_time_minutes = row_array[5].getMinutes()

  var bed_time_diff_hours = 24 - bed_time_hours
  var bed_time_diff_minutes = parseFloat(bed_time_minutes / 60)

  var total_diff = bed_time_diff_hours + bed_time_diff_minutes
  
  
  console.log(total_diff)
}

