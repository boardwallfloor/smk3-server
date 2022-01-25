const ExcelJS = require('exceljs')
const debug = require('debug')('export')
const { reportYearQuestion } = require('./reportYearQuestion')
const { reportSemesterQuestion } = require('./reportSemesterQuestion')
const moment = require('moment')

const handleUndefined = (data, type) => {
  if (type === 'semester') {
    if (typeof data === 'undefined') {
      return 0
    } else {
      return data.total
    }
  }
  if (type === 'year') {
    if (typeof data === 'undefined' || typeof data.information === 'undefined') {
      return '-'
    } else {
      if (typeof data.information == 'string') {
        return data.information
      }
      if (data.information && typeof data.information != 'string') {
        return 'Ada'
      }
      if (!data.information && typeof data.information != 'string') {
        return 'Tidak ada'
      }
    }
  }
}

const reportYearTemplate = async (data, res) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('sheet', {
    pageSetup: { fitToPage: true, fitToHeight: 1 }
  })
  sheet.getCell('A1').value = 'Nama Operator'
  sheet.getCell('A2').value = 'Tanggal Laporan'
  sheet.getCell('A3').value = 'Nama Fasyankes'
  sheet.getCell('A4').value = 'Status Validasi'
  // data.author.full_name
  for(let i = 0 ; i < data.length; i++){
    let columnLetter = String.fromCharCode(66+i)
    sheet.getCell(`${columnLetter}1`).value = data[i].author.full_name
    // date
    sheet.getCell(`${columnLetter}2`).value = moment(data[i].date).format('DD-MM-YYYY')
    // institution.name
    sheet.getCell(`${columnLetter}3`).value = data[i].institution.name
    // validated
    sheet.getCell(`${columnLetter}4`).value = data[i].validated
  }
  let rowCount = 5
  reportYearQuestion.map((props) => {
    for (const field in props) {
      sheet.getCell(`A${rowCount}`).value = props[field]
      rowCount++
    }
  })

  sheet.columns.forEach(function (column, i) {
    let maxLength = 0
    column.eachCell(function (cell) {
      const columnLength = cell.value ? cell.value.toString().length : 10
      if (columnLength > maxLength) {
        maxLength = columnLength
      }
    })

    column.width = maxLength < 10 ? 10 : maxLength
    column.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })
  const excelBook = { workbook: workbook, sheet: sheet }
  return excelBook
}

const reportSemesterTemplate = async (data) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('sheet', {
    pageSetup: { fitToPage: true, fitToHeight: 1 }
  })
  let rowCount = 5
  reportSemesterQuestion.map((props) => {
    sheet.getCell(`A${rowCount}`).value = props.question
    rowCount++
  })
  sheet.getCell('A1').value = 'Nama Operator'
  sheet.getCell('A2').value = 'Tanggal Laporan'
  sheet.getCell('A3').value = 'Nama Fasyankes'
  sheet.getCell('A4').value = 'Status Validasi'
  
  
  for(let i = 0 ; i < data.length; i++){
    let columnLetter = String.fromCharCode(66 + i)
    // data.author.full_name
    sheet.getCell(`${columnLetter}1`).value = data[i].author.full_name
    // date
    sheet.getCell(`${columnLetter}2`).value = moment(data[i].date).format('DD-MM-YYYY')
    // institution.name
    sheet.getCell(`${columnLetter}3`).value = data[i].institution.name
    // validated
    sheet.getCell(`${columnLetter}4`).value = data[i].validated
  }
  sheet.columns.forEach(function (column, i) {
    let maxLength = 0
    column.eachCell(function (cell) {
      const columnLength = cell.value ? cell.value.toString().length : 10
      if (columnLength > maxLength) {
        maxLength = columnLength
      }
    })

    column.width = maxLength < 10 ? 10 : maxLength
    column.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })
  const excelBook = { workbook: workbook, sheet: sheet }
  return excelBook
}

exports.reportSemesterToExcel = async (data, res) => {
  const { workbook, sheet } = await reportSemesterTemplate(data)
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8']
  let rowCount = 5
  reportSemesterQuestion.map((props) => {
    sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[rowCount - 1]], 'semester')
    rowCount++
  })
  await workbook.xlsx.write(res)
}

exports.allReportSemesterToExcel = async (data, res) => {
  const { workbook, sheet } = await reportSemesterTemplate(data)
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8']
  data.map((elem, index) => {
    let rowCount = 5
    reportSemesterQuestion.map((props) => {
      let columnLetter = String.fromCharCode(66 + index)
      sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(elem.report[questionList[rowCount - 1]], 'semester')
      rowCount++
    })
  })
  await workbook.xlsx.write(res)
}

exports.reportYearToExcel = async (data, res) => {
  try {
    const { workbook, sheet } = await reportYearTemplate(data)
    const questionLengthOne = ['question9']
    const questionLengthTwo = ['question6', 'question11', 'question5']
    const questionLengthThree = ['question1', 'question2', 'question7']
    const questionLengthFour = ['question3', 'question8', 'question4']
    const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']

    let rowCount = 5

    for (let i = 0; i < questionList.length; i++) {
      debug(rowCount)
      if (questionLengthOne.indexOf(Object.keys(data.report)[i]) !== -1) {
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]], 'year')
        rowCount++
      }
      if (questionLengthTwo.indexOf(Object.keys(data.report)[i]) !== -1) {
        for (const props in data.report[questionList[i]]) {
          sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]][props], 'year')
          rowCount++
        }
      }
      if (questionLengthThree.indexOf(Object.keys(data.report)[i]) !== -1) {
        for (const props in data.report[questionList[i]]) {
          sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]][props], 'year')
          rowCount++
        }
      }
      if (questionLengthFour.indexOf(Object.keys(data.report)[i]) !== -1) {
        for (const props in data.report[questionList[i]]) {
          sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]][props], 'year')
          rowCount++
        }
      }
      // console.log(Object.keys(data.report))
      if (Object.keys(data.report)[i] === 'question10') {
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].a, 'year')
        rowCount++
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].b.a, 'year')
        rowCount++
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].b.b, 'year')
        rowCount++
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].b.c, 'year')
        rowCount++
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].b.d, 'year')
        rowCount++
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].b.e, 'year')
        rowCount++
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].c.a, 'year')
        rowCount++
        sheet.getCell(`B${rowCount}`).value = handleUndefined(data.report[questionList[i]].c.b, 'year')
        rowCount++
      }
    }

    await workbook.xlsx.write(res)
  } catch (error) {
    return res.status(500).json(error)
  }
}

exports.allReportYearToExcel = async (data, res) => {
  try {
    const { workbook, sheet } = await reportYearTemplate(data)
    debug(data)
    const questionLengthOne = ['question9']
    const questionLengthTwo = ['question6', 'question11', 'question5']
    const questionLengthThree = ['question1', 'question2', 'question7']
    const questionLengthFour = ['question3', 'question8', 'question4']
    const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']
    for(let a = 0; a < data.length; a++){
      let columnLetterNumber = 66
      let rowCount = 5
      for (let i = 0; i < questionList.length; i++) {
        let columnLetter = String.fromCharCode(columnLetterNumber + a)
      if (questionLengthOne.indexOf(Object.keys(data[a].report)[i]) !== -1) {
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]], 'year')
        rowCount++
      }
      if (questionLengthTwo.indexOf(Object.keys(data[a].report)[i]) !== -1) {
        for (const props in data[a].report[questionList[i]]) {
          sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]][props], 'year')
          rowCount++
        }
      }
      if (questionLengthThree.indexOf(Object.keys(data[a].report)[i]) !== -1) {
        for (const props in data[a].report[questionList[i]]) {
          sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]][props], 'year')
          rowCount++
        }
      }
      if (questionLengthFour.indexOf(Object.keys(data[a].report)[i]) !== -1) {
        for (const props in data[a].report[questionList[i]]) {
          sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]][props], 'year')
          rowCount++
        }
      }
      
      if (Object.keys(data[a].report)[i] === 'question10') {
        
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].a, 'year')
        rowCount++
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].b.a, 'year')
        rowCount++
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].b.b, 'year')
        rowCount++
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].b.c, 'year')
        rowCount++
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].b.d, 'year')
        rowCount++
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].b.e, 'year')
        rowCount++
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].c.a, 'year')
        rowCount++
        sheet.getCell(`${columnLetter}${rowCount}`).value = handleUndefined(data[a].report[questionList[i]].c.b, 'year')
        rowCount++
      }
    }}

    await workbook.xlsx.write(res)
  } catch (error) {
    return res.status(500).json(error)
  }
}
