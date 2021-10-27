const ExcelJS = require('exceljs')
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
    if (typeof data === 'undefined') {
      return '-'
    } else {
      if (data.information) {
        return 'Ada'
      }
      if (!data.information) {
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
  // data.author.full_name
  sheet.getCell('A1').value = 'Nama Operator'
  sheet.getCell('B1').value = data.author.full_name
  // date
  sheet.getCell('A2').value = 'Tanggal Laporan'
  sheet.getCell('B2').value = moment(data.date).format('DD-MM-YYYY')
  // institution.name
  sheet.getCell('A3').value = 'Nama Fasyankes'
  sheet.getCell('B3').value = data.institution.name
  // validated
  sheet.getCell('A4').value = 'Status Validasi'
  sheet.getCell('B4').value = data.validated
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
  // data.author.full_name
  sheet.getCell('A1').value = 'Nama Operator'
  sheet.getCell('B1').value = data.author.full_name
  // date
  sheet.getCell('A2').value = 'Tanggal Laporan'
  sheet.getCell('B2').value = moment(data.date).format('DD-MM-YYYY')
  // institution.name
  sheet.getCell('A3').value = 'Nama Fasyankes'
  sheet.getCell('B3').value = data.institution.name
  // validated
  sheet.getCell('A4').value = 'Status Validasi'
  sheet.getCell('B4').value = data.validated
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
