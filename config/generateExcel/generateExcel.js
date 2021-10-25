const debug = require('debug')('excel')
const moment = require('moment')
const excelLayout = require('./generateLayout.js')
require('moment/locale/id')
moment.locale('id')

const boolToText = (boolData, type) => {
  // debug('boolData : %O',boolData)
  // debug('boolDataType : %O',typeof boolData)
  if (boolData === undefined) {
    undefinedToEmptySpace(boolData)
  }
  if (type !== 'report') {
  	if (!boolData) {
    	return 'Belum tervalidasi'
    } else {
      return 'Sudah tervalidasi'
    }
  }
  if (type === 'report') {
  	if (typeof boolData === 'string') {
  		return boolData
  	} else if (boolData) {
  		return 'Ada'
  	} else {
      return 'Tidak ada'
    }
  }
}

const undefinedToEmptySpace = (data) => {
  if (data === undefined || data == null) {
    debug(data)
    return ''
  }
  return data
}

const formatReportType = (reportType) => {
  if (reportType === 'semesterly') {
    return 'Laporan Semester'
  }
  if (reportType === 'yearly') {
    return 'Laporan Tahunan'
  }
}

exports.reportYearToExcel = (reportYear, res) => {
  const [ws, wb] = excelLayout.reportsYearHeader(reportYear, res)
  const reportType = 'report'

  // Filling cell
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']

  const questionLengthOne = ['question9']
  const questionLengthTwo = ['question6', 'question11']
  const questionLengthThree = ['question1', 'question2', 'question4', 'question5', 'question7']
  const questionLengthFour = ['question3', 'question8']

  // debug(reportYear.report[questionList[0]].a.information)
  let column = 6
  const row = 3
  for (let _a = 0; _a < questionList.length; _a++) {
    if (questionLengthTwo.indexOf(questionList[_a]) != -1) {
      debug(questionList[_a])
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].a.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].b.information, reportType))
      column++
    }
    if (questionLengthOne.indexOf(questionList[_a]) != -1) {
      debug(questionList[_a])
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].information, reportType))
      column++
    }
    if (questionLengthThree.indexOf(questionList[_a]) != -1) {
      debug(questionList[_a])
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].a.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].b.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].c.information, reportType))
      column++
    }
    if (questionLengthFour.indexOf(questionList[_a]) != -1) {
      debug(questionList[_a])
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].a.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].b.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].c.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].d.information, reportType))
      column++
    }
    if (questionList[_a] === 'question10') {
      debug(questionList[_a])
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].a.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].b.a.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].b.b.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].b.c.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].c.a.information, reportType))
      column++
      // debug(row)
      ws.cell(row, column).string(boolToText(reportYear.report[questionList[_a]].c.b.information, reportType))
      column++
    }
  }
  // author
  ws.cell(4, 1).string(reportYear.author.full_name)
  ws.column(1).setWidth(50)
  // date
  ws.cell(4, 2).string(moment(reportYear.year).format('YYYY'))
  ws.column(2).setWidth(20)

  // validated
  ws.cell(4, 3).string(boolToText(reportYear.validated))
  ws.column(3).setWidth(25)

  // institution
  ws.cell(4, 4).string(reportYear.institution.name)
  ws.column(4).setWidth(45)

  // jumlah sdm
  // ws.cell(4, 5).number(reportYear.totalSDM)
  // ws.column(5).setWidth(45)

  wb.write('Excel.xlsx', res)
}

exports.reportSemesterToExcel = (reportSemester, res) => {
  const reportType = 'report'
  const [ws, wb] = excelLayout.reportsSemesterHeader(reportSemester, res)

  ws.cell(3, 1).string(reportSemester.author.full_name)
  // Date input
  ws.cell(3, 2).string(moment(reportSemester.date).format('LL'))
  // Author input
  ws.cell(3, 3).string(boolToText(reportSemester.validated))
  // Fasyankes input
  ws.cell(3, 4).string(reportSemester.institution.name)

  // report group
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8']
  for (let _a = 0; _a < questionList.length; _a++) {
    const calc = 5 + (_a * 2)
    ws.cell(3, calc).number(reportSemester.report[questionList[_a]].total)
    ws.cell(3, calc + 1).string(undefinedToEmptySpace(reportSemester.report[questionList[_a]].detail))
  }

  debug('Generate File')

  wb.write('Excel.xlsx', res)
}

exports.reportsYearAllToExcel = (reportYear, res, length) => {
  const reportType = 'report'
  const [ws, wb] = excelLayout.reportsYearHeader(reportYear, res)
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']

  const questionLengthOne = ['question9']
  const questionLengthTwo = ['question6', 'question11']
  const questionLengthThree = ['question1', 'question2', 'question4', 'question5', 'question7']
  const questionLengthFour = ['question3', 'question8']

  // Filling data
  let row = 4
  debug('Array length : %O', length)

  for (let _b = 0; _b < length; _b++) {
    // author
    ws.cell(row, 1).string(reportYear[_b].author.full_name)
    ws.column(1).setWidth(50)

    // date
    ws.cell(row, 2).string(moment(reportYear[_b].year).format('YYYY'))
    ws.column(2).setWidth(20)

    // validated
    ws.cell(row, 3).string(boolToText(reportYear[_b].validated))
    ws.column(3).setWidth(25)

    // institution
    ws.cell(row, 4).string(reportYear[_b].institution.name)
    ws.column(4).setWidth(45)

    // jumlah sdm
    // ws.cell(row, 5).number(reportYear[_b].totalSDM)
    // ws.column(5).setWidth(45)
    debug('Row : %O', row)
    let column = 6
    for (let _a = 0; _a < questionList.length; _a++) {
      // debug('Column : %O', column)
      // debug(reportYear)
      // debug(questionList[_a])
      if (questionLengthTwo.indexOf(questionList[_a]) != -1) {
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].b.information, reportType))
        column++
      }
      if (questionLengthOne.indexOf(questionList[_a]) != -1) {
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].information, reportType))
        column++
      }
      if (questionLengthThree.indexOf(questionList[_a]) != -1) {
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].b.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].c.information, reportType))
        column++
      }
      if (questionLengthFour.indexOf(questionList[_a]) != -1) {
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].b.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].c.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].d.information, reportType))
        column++
      }
      if (questionList[_a] === 'question10') {
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].b.a.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].b.b.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].b.c.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].c.a.information, reportType))
        column++
        // debug(row)
        ws.cell(row, column).string(boolToText(reportYear[_b].report[questionList[_a]].c.b.information, reportType))
        column++
      }
    }
    row++
  }

  wb.write('Excel.xlsx', res)
}

exports.reportsSemesterAllToExcel = (reportSemester, res, length) => {
  const reportType = 'report'
  const [ws, wb] = excelLayout.reportsSemesterHeader(reportSemester, res)

  let row = 3
  debug(length)
  for (let _a = 0; _a < length; _a++) {
    debug(`reportSemester${_a}`)
    ws.cell(row, 1).string(reportSemester[_a].author.full_name)
    // Date input
    ws.cell(row, 2).string(moment(reportSemester[_a].date).format('LL'))
    // Author input
    ws.cell(row, 3).string(boolToText(reportSemester[_a].validated))
    // Fasyankes input
    ws.cell(row, 4).string(reportSemester[_a].institution.name)

    // report group
    const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8']
    for (let _b = 0; _b < questionList.length; _b++) {
      const calc = 5 + (_b * 2)
      // debug("questionList : %o",questionList[_a])
      ws.cell(row, calc).number(reportSemester[_a].report[questionList[_b]].total)
      ws.cell(row, calc + 1).string(undefinedToEmptySpace(reportSemester[_a].report[questionList[_b]].detail))
    }
    row++
  }

  debug('Generate File')

  wb.write('Excel.xlsx', res)
}

exports.notificationToExcel = (notification, res) => {
  const reportType = 'report'
  const [ws, wb] = excelLayout.notificationHeader(notification, res)

  ws.cell(2, 1).string(formatReportType(notification.report_type))
  ws.column(1).setWidth(50)
  // date
  ws.cell(2, 2).string((moment(notification.remind_date).format('LL')))
  ws.column(2).setWidth(20)

  // validated
  ws.cell(2, 3).string(notification.notification_status)
  ws.column(3).setWidth(25)

  // institution
  ws.cell(2, 4).string(notification.remindee.full_name)
  ws.column(4).setWidth(45)

  debug('Sending file')

  wb.write('Excel.xlsx', res)
}
exports.notificationAllToExcel = (notification, res, length) => {
  debug(length)
  const reportType = 'report'
  const [ws, wb] = excelLayout.notificationHeader(notification, res)

  let row = 2
  for (let _a = 0; _a < length; _a++) {
    ws.cell(row, 1).string(formatReportType(notification[_a].report_type))
    ws.column(1).setWidth(50)

    ws.cell(row, 2).string((moment(notification[_a].remind_date).format('LL')))
    ws.column(2).setWidth(20)

    ws.cell(row, 3).string(notification[_a].notification_status)
    ws.column(3).setWidth(25)

    ws.cell(row, 4).string(undefinedToEmptySpace(notification[_a].remindee.full_name))
    ws.column(4).setWidth(45)
    row++
  }

  debug('Sending file')

  wb.write('Excel.xlsx', res)
}
