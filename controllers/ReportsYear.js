const async = require('async')
const debug = require('debug')('reportyear')
const { body, validationResult } = require('express-validator')

const Report = require('../models/report_year')
const ReportSemester = require('../models/report_semester')
const Notification = require('../models/notification')
const User = require('../models/user')
const exportFile = require('../config/generateExcel/generateExcel')
const exportToExcel = require('../config/generateExcel/generateLayout')

const handleFilter = (filter) => {
  const filterJson = JSON.parse(filter)
  return filterJson
}

const handleRange = (range) => {
  const rangeJson = JSON.parse(range)
  const [start, end] = rangeJson
  const limitation = end - start + 1
  return [start, limitation]
}

const handleSort = (sort) => {
  const sortJson = JSON.parse(sort)
  const [resource, order] = sortJson
  const orderLowerCase = order.toLowerCase()
  const sortOn = {
    [resource]: [orderLowerCase]
  }
  return sortOn
}

const checkIfReminderExist = (author, date) => {
  debug(date)
  let inputMonthMin, inputMonthMax

  const inputDate = new Date(date)
  debug(inputDate)
  const inputMonth = inputDate.getMonth()
  const inputYear = inputDate.getFullYear()

  if (inputMonth < 6) {
    inputMonthMin = 0
    inputMonthMax = 5
  } else if (inputMonth >= 6) {
    inputMonthMin = 6
    inputMonthMax = 11
  }

  debug('inputMonthMax :  %O', inputMonthMax)
  debug('inputMonthMin :  %O', inputMonthMin)
  debug('inputYear :  %O', inputYear)
  debug(`Notification.findOne({ remind_date: { $gte: ${inputYear}-${inputMonthMin}-01, $lte: ${inputYear}-${inputMonthMax}-31 }, remindee: ${author}, report_type : 'yearly' })`)
  return Notification.findOne({ remind_date: { $gte: `${inputYear}-${inputMonthMin}-01`, $lte: `${inputYear}-${inputMonthMax}-31` }, remindee: author, report_type: 'yearly' })
}

exports.set_header = (req, res, next) => {
  Report.countDocuments().exec((err, results) => {
    if (err) return res.status(400).json('Unable to set header')
    res.set('Content-Range', results)
    next()
  })
}

exports.show_all = async (req, res, next) => {
  debug(req.query)
  // debug(Object.keys(req.query).length)

  if (Object.keys(req.query).length === 0) {
    debug('No query')
    Report.find({}).exec(
      (err, results) => {
        if (err) { return next(err) }
        debug(results)
        res.json(results)
      }
    )
  } else {
    debug('Query :')
    debug(req.query)
    let filter
    let start, limitation
    let sort
    const select = req.query.select
    if (req.query.range != undefined) {
      const range = await handleRange(req.query.range);
      [start, limitation] = range
    }

    if (req.query.filter != undefined) {
      filter = await handleFilter(req.query.filter)
    }

    if (req.query.sort != undefined) {
      sort = handleSort(req.query.sort)
    }

    Report.find(filter).sort(sort).skip(start).select(select).limit(limitation).exec(
      (err, results) => {
        res.json(results)
      })
  }
}

exports.show_one = (req, res, next) => {
  Report.findById(req.params.id).exec(
    (err, results) => {
      if (err) { return next(err) }
      debug(results)
      res.json(results)
    }
  )
}

exports.show_ten = async (req, res, next) => {
  let filter = {}
  debug(req.query)

  if (req.query.filter != undefined) {
    filter = await handleFilter(req.query.filter)
  }
  async.parallel({
    data: (callback) => {
      Report.find(filter).populate('author').populate('institution').sort({ year: 'desc' }).limit(10).exec(callback)
    },
    count: (callback) => {
      Report.countDocuments(filter).exec(callback)
    }
  }, (err, results) => {
    if (err) { return next(err) }
    debug(results)
    res.json(results)
  })
}

const addEmptyFilePropertyToBody = (report) => {
  debug('Add Empty')
  const pointListOne = ['a']
  const pointListTwo = ['a', 'b']
  const pointListThree = ['a', 'b', 'c']
  const pointListFour = ['a', 'b', 'c', 'd']
  const pointListFive = ['a', 'b', 'c', 'd','e']

  const questionLengthOne = ['question9']
  const questionLengthTwo = ['question6', 'question11', 'question5']
  const questionLengthThree = ['question1', 'question2', 'question7']
  const questionLengthFour = ['question3', 'question8', 'question4']
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']

  const addEmptyObjectToQuestions = () => {
    const reportObjectKey = Object.keys(report)
    // debug('Filled Input %O',reportObjectKey)
    for (let a = 0; a < questionList.length; a++) {
      if (reportObjectKey.indexOf(questionList[a]) === -1) {
        report[questionList[a]] = {}
      }
    }

    // debug(report)
  }

  const addEmptyObjectToQuestionsChild = () => {
    Object.keys(report).forEach((questions, index) => {
      if (questionLengthOne.indexOf(questions) != -1) {
        // debug('Question category : Length One')
        if (questions === 'question9') {
          report[questions].file = {}
        } else {
          for (let a = 0; a < pointListOne.length; a++) {
            // debug(`report.${questions}.${pointListOne[a]}`)
            if (!report[questions][pointListOne[a]]) {
              report[questions][pointListOne[a]] = {}
            }
            if (!report[questions][pointListOne[a]].file) {
              // debug(pointListOne[a])
              report[questions][pointListOne[a]].file = {}
            }
          }
        }
      }

      // if exist && length = 2 and for loop
      if (questionLengthTwo.indexOf(questions) != -1) {
        // debug('Question category : Length Two')
        for (let a = 0; a < pointListTwo.length; a++) {
          // debug(`report.${questions}.${pointListTwo[a]}`)
          if (!report[questions][pointListTwo[a]]) {
            report[questions][pointListTwo[a]] = {}
          }
          if (!report[questions][pointListTwo[a]].file) {
            // debug(pointListTwo[a])
            report[questions][pointListTwo[a]].file = {}
          }
        }
      }

      // if exist && length = 3 and for loop
      if (questionLengthThree.indexOf(questions) != -1) {
        // debug('Question category : Length Three')
        for (let a = 0; a < pointListThree.length; a++) {
          // debug(`report.${questions}.${pointListTwo[a]}`)
          if (!report[questions][pointListThree[a]]) {
            report[questions][pointListThree[a]] = {}
          }
          if (!report[questions][pointListThree[a]].file) {
            // debug(pointListTwo[a])
            report[questions][pointListThree[a]].file = {}
          }
        }
      }

      // if exist && length = 4 and for loop
      if (questionLengthFour.indexOf(questions) != -1) {
        // debug('Question category : Length Four')
        for (let a = 0; a < pointListFour.length; a++) {
          // debug(`report.${questions}.${pointListFour[a]}`)
          if (!report[questions][pointListFour[a]]) {
            report[questions][pointListFour[a]] = {}
          }
          if (!report[questions][pointListFour[a]].file) {
            // debug(pointListFour[a])
            report[questions][pointListFour[a]].file = {}
          }
        }
        // debug(report[questions])
      }

      // if question10
      if (questions === 'question10') {
        // debug('Question Category 10')
        // Assign empty letter branch
        const question10Key = Object.keys(report[questions])
        // debug(question10Key)
        for (let a = 0; a < pointListThree.length; a++) {
          // debug('Branch 1')
          // debug(`report.${questions}.${pointListFour[a]}`)
          // Assigning Empty in reporty.question[_var] if not exist, also solve _a since a is first branch in object
          if (question10Key.indexOf(pointListThree[a]) === -1) {
            // debug('Empties made %o',a)
            report[questions][pointListThree[a]] = {}
          }
          // debug(`report.${questions}.${pointListThree[a]}`)
        }
        // debug(report[questions])
        for (let a = 0; a < pointListThree.length; a++) {
          // debug('Branch 2')
          if (pointListThree[a] === 'a') {
            if (!report[questions][pointListThree[a]].file) {
              report[questions][pointListThree[a]].file = {}
              // debug('a %O',report[questions][pointListThree[a]])
            }
          }
          if (pointListThree[a] === 'b') {
            for (let i = 0; i < pointListFive.length; i++) {
              if (!report[questions][pointListThree[a]][pointListFive[i]]) {
                report[questions][pointListThree[a]][pointListFive[i]] = {}
              }
              if (!report[questions][pointListThree[a]][pointListFive[i]].file) {
                report[questions][pointListThree[a]][pointListFive[i]].file = {}
                // debug('b %O',report[questions][pointListThree[a]])
              }
            }
          }
          if (pointListThree[a] === 'c') {
            for (let i = 0; i < pointListTwo.length; i++) {
              if (!report[questions][pointListThree[a]][pointListTwo[i]]) {
                report[questions][pointListThree[a]][pointListTwo[i]] = {}
              }
              if (!report[questions][pointListThree[a]][pointListTwo[i]].file) {
                report[questions][pointListThree[a]][pointListTwo[i]].file = {}
              }
              // debug('c %O',report[questions][pointListThree[a]][pointListTwo[i]])
            }
          }
        }

        // debug('Question 10 %O',report[questions])
      }
    })
    // debug('Report : %O',report)
  }
  addEmptyObjectToQuestions()
  debug('1 %O', report)
  addEmptyObjectToQuestionsChild()
  debug('2 %O', report)
  return report
}

exports.create = async (req, res, next) => {
  try {
    debug('Body : ')
    debug(req.body)

    const newFileInput = await addEmptyFilePropertyToBody(req.body.report)
    debug('New File Input : %O', newFileInput)

    const report = new Report({
      author: req.body.author,
      totalSDM: req.body.totalSDM,
      institution: req.body.institution,
      year: req.body.year,
      validated: req.body.validated,
      report: {
        question1: {
          a: {
            information: newFileInput.question1.a.information,
            comment: newFileInput.question1.a.comment,
            file: {
              title: newFileInput.question1.a.file.title,
              src: newFileInput.question1.a.file.src
            }
          },
          b: {
            information: newFileInput.question1.b.information,
            comment: newFileInput.question1.b.comment,
            file: {
              title: newFileInput.question1.b.file.title,
              src: newFileInput.question1.b.file.src
            }
          },
          c: {
            information: newFileInput.question1.c.information,
            comment: newFileInput.question1.c.comment,
            file: {
              title: newFileInput.question1.c.file.title,
              src: newFileInput.question1.c.file.src
            }
          }
        },
        question2: {
          a: {
            information: newFileInput.question2.a.information,
            comment: newFileInput.question2.a.comment,
            file: {
              title: newFileInput.question2.a.file.title,
              src: newFileInput.question2.a.file.src
            }
          },
          b: {
            information: newFileInput.question2.b.information,
            comment: newFileInput.question2.b.comment,
            file: {
              title: newFileInput.question2.b.file.title,
              src: newFileInput.question2.b.file.src
            }
          },
          c: {
            information: newFileInput.question2.c.information,
            comment: newFileInput.question2.c.comment,
            file: {
              title: newFileInput.question2.c.file.title,
              src: newFileInput.question2.c.file.src
            }
          }
        },
        question3: {
          a: {
            information: newFileInput.question3.a.information,
            comment: newFileInput.question3.a.comment,
            file: {
              title: newFileInput.question3.a.file.title,
              src: newFileInput.question3.a.file.src
            }
          },
          b: {
            information: newFileInput.question3.b.information,
            comment: newFileInput.question3.b.comment,
            file: {
              title: newFileInput.question3.b.file.title,
              src: newFileInput.question3.b.file.src
            }
          },
          c: {
            information: newFileInput.question3.c.information,
            comment: newFileInput.question3.c.comment,
            file: {
              title: newFileInput.question3.c.file.title,
              src: newFileInput.question3.c.file.src
            }
          },
          d: {
            information: newFileInput.question3.d.information,
            comment: newFileInput.question3.d.comment,
            file: {
              title: newFileInput.question3.d.file.title,
              src: newFileInput.question3.d.file.src
            }
          }
        },
        question4: {
          a: {
            information: newFileInput.question4.a.information,
            comment: newFileInput.question4.a.comment,
            file: {
              title: newFileInput.question4.a.file.title,
              src: newFileInput.question4.a.file.src
            }
          },
          b: {
            information: newFileInput.question4.b.information,
            comment: newFileInput.question4.b.comment,
            file: {
              title: newFileInput.question4.b.file.title,
              src: newFileInput.question4.b.file.src
            }
          },
          c: {
            information: newFileInput.question4.c.information,
            comment: newFileInput.question4.c.comment,
            file: {
              title: newFileInput.question4.c.file.title,
              src: newFileInput.question4.c.file.src
            }
          },
          d: {
            information: newFileInput.question4.d.information,
            comment: newFileInput.question4.d.comment,
            file: {
              title: newFileInput.question4.d.file.title,
              src: newFileInput.question4.d.file.src
            }
          }
        },
        question5: {
          a: {
            information: newFileInput.question5.a.information,
            comment: newFileInput.question5.a.comment,
            file: {
              title: newFileInput.question5.a.file.title,
              src: newFileInput.question5.a.file.src
            }
          },
          b: {
            information: newFileInput.question5.b.information,
            comment: newFileInput.question5.b.comment,
            file: {
              title: newFileInput.question5.b.file.title,
              src: newFileInput.question5.b.file.src
            }
          }
        },
        question6: {
          a: {
            information: newFileInput.question6.a.information,
            comment: newFileInput.question6.a.comment,
            file: {
              title: newFileInput.question6.a.file.title,
              src: newFileInput.question6.a.file.src
            }
          },
          b: {
            information: newFileInput.question6.b.information,
            comment: newFileInput.question6.b.comment,
            file: {
              title: newFileInput.question6.b.file.title,
              src: newFileInput.question6.b.file.src
            }
          }
        },
        question7: {
          a: {
            information: newFileInput.question7.a.information,
            comment: newFileInput.question7.a.comment,
            file: {
              title: newFileInput.question7.a.file.title,
              src: newFileInput.question7.a.file.src
            }
          },
          b: {
            information: newFileInput.question7.b.information,
            comment: newFileInput.question7.b.comment,
            file: {
              title: newFileInput.question7.b.file.title,
              src: newFileInput.question7.b.file.src
            }
          },
          c: {
            information: newFileInput.question7.c.information,
            comment: newFileInput.question7.c.comment,
            file: {
              title: newFileInput.question7.c.file.title,
              src: newFileInput.question7.c.file.src
            }
          }
        },
        question8: {
          a: {
            information: newFileInput.question8.a.information,
            comment: newFileInput.question8.a.comment,
            file: {
              title: newFileInput.question8.a.file.title,
              src: newFileInput.question8.a.file.src
            }
          },
          b: {
            information: newFileInput.question8.b.information,
            comment: newFileInput.question8.b.comment,
            file: {
              title: newFileInput.question8.b.file.title,
              src: newFileInput.question8.b.file.src
            }
          },
          c: {
            information: newFileInput.question8.c.information,
            comment: newFileInput.question8.c.comment,
            file: {
              title: newFileInput.question8.c.file.title,
              src: newFileInput.question8.c.file.src
            }
          },
          d: {
            information: newFileInput.question8.d.information,
            comment: newFileInput.question8.d.comment,
            file: {
              title: newFileInput.question8.d.file.title,
              src: newFileInput.question8.d.file.src
            }
          }
        },
        question9: {
          information: newFileInput.question9.information,
          comment: newFileInput.question9.comment,
          file: {
            title: newFileInput.question9.file.title,
            src: newFileInput.question9.file.src
          }
        },

        question10: {
          a: {
            information: newFileInput.question10.a.information,
            comment: newFileInput.question10.a.comment,
            file: {
              title: newFileInput.question10.a.file.title,
              src: newFileInput.question10.a.file.src
            }
          },
          b: {
            a: {
              information: newFileInput.question10.b.a.information,
              comment: newFileInput.question10.b.a.comment,
              file: {
                title: newFileInput.question10.b.a.file.title,
                src: newFileInput.question10.b.a.file.src
              }
            },
            b: {
              information: newFileInput.question10.b.b.information,
              comment: newFileInput.question10.b.b.comment
            },
            c: {
              information: newFileInput.question10.b.c.information,
              comment: newFileInput.question10.b.c.comment
            },
            d: {
              information: newFileInput.question10.b.d.information,
              comment: newFileInput.question10.b.d.comment
            },
            e: {
              information: newFileInput.question10.b.e.information,
              comment: newFileInput.question10.b.e.comment
            }
          },
          c: {
            a: {
              information: newFileInput.question10.c.a.information,
              comment: newFileInput.question10.c.a.comment,
              file: {
                title: newFileInput.question10.c.a.file.title,
                src: newFileInput.question10.c.a.file.src
              }
            },
            b: {
              information: newFileInput.question10.c.b.information,
              comment: newFileInput.question10.c.b.comment,
              file: {
                title: newFileInput.question10.c.b.file.title,
                src: newFileInput.question10.c.b.file.src
              }
            }
          }
        },
        question11: {
          a: {
            information: newFileInput.question11.a.information,
            comment: newFileInput.question11.a.comment,
            file: {
              title: newFileInput.question11.a.file.title,
              src: newFileInput.question11.a.file.src
            }
          },
          b: {
            information: newFileInput.question11.b.information,
            comment: newFileInput.question11.b.comment
          }
        }
      }
    })
    const isReportIsNotValid = report.validateSync()
    if (isReportIsNotValid) {
      return res.status(400).json(isReportIsNotValid)
    }
    debug(report)
    Report.create(report, async (err, results) => {
      if (err) { return res.status(400).json(err) }
      // debug(results)
      // res.send("Successfully created per Year Report");
      const reminderStatusQuery = await checkIfReminderExist(req.body.author, req.body.year)
      debug(reminderStatusQuery)
      if (reminderStatusQuery) {
        debug(reminderStatusQuery.notification_status)
        reminderStatusQuery.notification_status = 'Laporan Dibuat'
        debug('Reminder status changed')
        await reminderStatusQuery.save()
      }
      res.json(results)
    })
  } catch (err) {
    debug(err)
    return res.status(500).json('Server error')
  }
}

exports.update = async (req, res, next) => {
  // debug(req.body)
  try {
    debug('Validated status : %o', req.body.validated)
    const error = validationResult(req)
    if (!error.isEmpty()) {
      debug('Error : %O', error.errors)
      throw new Error()
    } else {
      const newFileInput = await addEmptyFilePropertyToBody(req.body.report)
      debug('New File Input : %O', newFileInput)

      const report = new Report({
        _id : req.params.id,
        author: req.body.author,
        totalSDM: req.body.totalSDM,
        institution: req.body.institution,
        year: req.body.year,
        validated: req.body.validated,
        report: {
          question1: {
            a: {
              information: newFileInput.question1.a.information,
              comment: newFileInput.question1.a.comment,
              file: {
                title: newFileInput.question1.a.file.title,
                src: newFileInput.question1.a.file.src
              }
            },
            b: {
              information: newFileInput.question1.b.information,
              comment: newFileInput.question1.b.comment,
              file: {
                title: newFileInput.question1.b.file.title,
                src: newFileInput.question1.b.file.src
              }
            },
            c: {
              information: newFileInput.question1.c.information,
              comment: newFileInput.question1.c.comment,
              file: {
                title: newFileInput.question1.c.file.title,
                src: newFileInput.question1.c.file.src
              }
            }
          },
          question2: {
            a: {
              information: newFileInput.question2.a.information,
              comment: newFileInput.question2.a.comment,
              file: {
                title: newFileInput.question2.a.file.title,
                src: newFileInput.question2.a.file.src
              }
            },
            b: {
              information: newFileInput.question2.b.information,
              comment: newFileInput.question2.b.comment,
              file: {
                title: newFileInput.question2.b.file.title,
                src: newFileInput.question2.b.file.src
              }
            },
            c: {
              information: newFileInput.question2.c.information,
              comment: newFileInput.question2.c.comment,
              file: {
                title: newFileInput.question2.c.file.title,
                src: newFileInput.question2.c.file.src
              }
            }
          },
          question3: {
            a: {
              information: newFileInput.question3.a.information,
              comment: newFileInput.question3.a.comment,
              file: {
                title: newFileInput.question3.a.file.title,
                src: newFileInput.question3.a.file.src
              }
            },
            b: {
              information: newFileInput.question3.b.information,
              comment: newFileInput.question3.b.comment,
              file: {
                title: newFileInput.question3.b.file.title,
                src: newFileInput.question3.b.file.src
              }
            },
            c: {
              information: newFileInput.question3.c.information,
              comment: newFileInput.question3.c.comment,
              file: {
                title: newFileInput.question3.c.file.title,
                src: newFileInput.question3.c.file.src
              }
            },
            d: {
              information: newFileInput.question3.d.information,
              comment: newFileInput.question3.d.comment,
              file: {
                title: newFileInput.question3.d.file.title,
                src: newFileInput.question3.d.file.src
              }
            }
          },
          question4: {
            a: {
              information: newFileInput.question4.a.information,
              comment: newFileInput.question4.a.comment,
              file: {
                title: newFileInput.question4.a.file.title,
                src: newFileInput.question4.a.file.src
              }
            },
            b: {
              information: newFileInput.question4.b.information,
              comment: newFileInput.question4.b.comment,
              file: {
                title: newFileInput.question4.b.file.title,
                src: newFileInput.question4.b.file.src
              }
            },
            c: {
              information: newFileInput.question4.c.information,
              comment: newFileInput.question4.c.comment,
              file: {
                title: newFileInput.question4.c.file.title,
                src: newFileInput.question4.c.file.src
              }
            },
            d: {
              information: newFileInput.question4.d.information,
              comment: newFileInput.question4.d.comment,
              file: {
                title: newFileInput.question4.d.file.title,
                src: newFileInput.question4.d.file.src
              }
            }
          },
          question5: {
            a: {
              information: newFileInput.question5.a.information,
              comment: newFileInput.question5.a.comment,
              file: {
                title: newFileInput.question5.a.file.title,
                src: newFileInput.question5.a.file.src
              }
            },
            b: {
              information: newFileInput.question5.b.information,
              comment: newFileInput.question5.b.comment,
              file: {
                title: newFileInput.question5.b.file.title,
                src: newFileInput.question5.b.file.src
              }
            }
          },
          question6: {
            a: {
              information: newFileInput.question6.a.information,
              comment: newFileInput.question6.a.comment,
              file: {
                title: newFileInput.question6.a.file.title,
                src: newFileInput.question6.a.file.src
              }
            },
            b: {
              information: newFileInput.question6.b.information,
              comment: newFileInput.question6.b.comment,
              file: {
                title: newFileInput.question6.b.file.title,
                src: newFileInput.question6.b.file.src
              }
            }
          },
          question7: {
            a: {
              information: newFileInput.question7.a.information,
              comment: newFileInput.question7.a.comment,
              file: {
                title: newFileInput.question7.a.file.title,
                src: newFileInput.question7.a.file.src
              }
            },
            b: {
              information: newFileInput.question7.b.information,
              comment: newFileInput.question7.b.comment,
              file: {
                title: newFileInput.question7.b.file.title,
                src: newFileInput.question7.b.file.src
              }
            },
            c: {
              information: newFileInput.question7.c.information,
              comment: newFileInput.question7.c.comment,
              file: {
                title: newFileInput.question7.c.file.title,
                src: newFileInput.question7.c.file.src
              }
            }
          },
          question8: {
            a: {
              information: newFileInput.question8.a.information,
              comment: newFileInput.question8.a.comment,
              file: {
                title: newFileInput.question8.a.file.title,
                src: newFileInput.question8.a.file.src
              }
            },
            b: {
              information: newFileInput.question8.b.information,
              comment: newFileInput.question8.b.comment,
              file: {
                title: newFileInput.question8.b.file.title,
                src: newFileInput.question8.b.file.src
              }
            },
            c: {
              information: newFileInput.question8.c.information,
              comment: newFileInput.question8.c.comment,
              file: {
                title: newFileInput.question8.c.file.title,
                src: newFileInput.question8.c.file.src
              }
            },
            d: {
              information: newFileInput.question8.d.information,
              comment: newFileInput.question8.d.comment,
              file: {
                title: newFileInput.question8.d.file.title,
                src: newFileInput.question8.d.file.src
              }
            }
          },
          question9: {
            information: newFileInput.question9.information,
            comment: newFileInput.question9.comment,
            file: {
              title: newFileInput.question9.file.title,
              src: newFileInput.question9.file.src
            }
          },
  
          question10: {
            a: {
              information: newFileInput.question10.a.information,
              comment: newFileInput.question10.a.comment,
              file: {
                title: newFileInput.question10.a.file.title,
                src: newFileInput.question10.a.file.src
              }
            },
            b: {
              a: {
                information: newFileInput.question10.b.a.information,
                comment: newFileInput.question10.b.a.comment,
                file: {
                  title: newFileInput.question10.b.a.file.title,
                  src: newFileInput.question10.b.a.file.src
                }
              },
              b: {
                information: newFileInput.question10.b.b.information,
                comment: newFileInput.question10.b.b.comment
              },
              c: {
                information: newFileInput.question10.b.c.information,
                comment: newFileInput.question10.b.c.comment
              },
              d: {
                information: newFileInput.question10.b.d.information,
                comment: newFileInput.question10.b.d.comment
              },
              e: {
                information: newFileInput.question10.b.e.information,
                comment: newFileInput.question10.b.e.comment
              }
            },
            c: {
              a: {
                information: newFileInput.question10.c.a.information,
                comment: newFileInput.question10.c.a.comment,
                file: {
                  title: newFileInput.question10.c.a.file.title,
                  src: newFileInput.question10.c.a.file.src
                }
              },
              b: {
                information: newFileInput.question10.c.b.information,
                comment: newFileInput.question10.c.b.comment,
                file: {
                  title: newFileInput.question10.c.b.file.title,
                  src: newFileInput.question10.c.b.file.src
                }
              }
            }
          },
          question11: {
            a: {
              information: newFileInput.question11.a.information,
              comment: newFileInput.question11.a.comment,
              file: {
                title: newFileInput.question11.a.file.title,
                src: newFileInput.question11.a.file.src
              }
            },
            b: {
              information: newFileInput.question11.b.information,
              comment: newFileInput.question11.b.comment
            }
          }
        }
      })
      // report.isNew = false
      const isReportIsNotValid = report.validateSync()
      if (isReportIsNotValid) {
        return res.status(400).json(isReportIsNotValid)
      }
      debug(report)
      Report.findByIdAndUpdate(req.params.id, report, (err, results) => {
        if (err) { return (next(err)) }
        debug(results)
        // res.send("Successfully updated per Year Report");
        res.send(results)
      })
    }
  } catch (err) {
    return res.status(500).json('Server error')
  }
}

exports.delete = (req, res, next) => {
  Report.findByIdAndRemove(req.params.id).exec((err, results) => {
    if (err) { return next(err) }
    // res.send("Sucessfully deleted per Year Report");
    res.json(results)
  })
}

exports.export = async (req, res, next) => {
  let excludedFileList = ''
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']
  const pointListFour = ['a', 'b', 'c', 'd']

  for (let a = 0; a < questionList.length; a++) {
    for (let i = 0; i < 4; i++) {
      if (questionList[i] === 'question10') {
        for (let _b = 0; _b < 4; _b++) {
          excludedFileList += '-report.' + questionList[a] + pointListFour[i] + pointListFour[_b] + '.file'
        }
      } else {
        excludedFileList += '-report.' + questionList[a] + '.' + pointListFour[i] + '.file'
      }
      if (a != questionList.length) {
        excludedFileList += ' '
      }
    }
  }

  debug(excludedFileList)
  const fetchedReport = await Report.findById(req.params.id).select(excludedFileList).populate('institution', 'name').populate('author', 'full_name').lean(
  )
  if (fetchedReport === null) {
    return res.status(400).json('Unable to find data')
  }
  await exportToExcel.reportYearToExcel(fetchedReport, res)
}

exports.exportall = async (req, res, next) => {
  let excludedFileList = ''
  const questionList = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']
  const pointListFour = ['a', 'b', 'c', 'd']

  for (let a = 0; a < questionList.length; a++) {
    for (let i = 0; i < 4; i++) {
      if (questionList[i] === 'question10') {
        for (let _b = 0; _b < 4; _b++) {
          excludedFileList += '-report.' + questionList[a] + pointListFour[i] + pointListFour[_b] + '.file'
        }
      } else {
        excludedFileList += '-report.' + questionList[a] + '.' + pointListFour[i] + '.file'
      }
      if (a != questionList.length) {
        excludedFileList += ' '
      }
    }
  }
  debug('Query : %O', req.query)
  let filter

  if (req.query.filter !== undefined) {
    // handle date, institution
    filter = await handleFilter(req.query.filter)
    debug('filter in Json : %o', filter)
    if (filter.hasOwnProperty('username')) {
      debug('Query username : %o', filter.username)
      const results = await User.find({ username: filter.username }).select('_id').exec()
      debug('User id : %o', results)
      filter.author = results[0]._id
      delete filter.username
    }
    if (filter.hasOwnProperty('date')) {
      debug('Input Date : %o', filter.date)
      const [queryDateStart, queryDateEnd] = filter.date
      let inputMonthMin, inputMonthMax

      dateStart = new Date(queryDateStart)
      dateEnd = new Date(queryDateEnd)

      debug('dateStart : %o', dateStart)
      debug('dateEnd : %o', dateEnd)

      const dateStartObject = {
        year: dateStart.getFullYear(),
        month: dateStart.getMonth(),
        date: dateStart.getDay()
      }
      const dateEndObject = {
        year: dateEnd.getFullYear(),
        month: dateEnd.getMonth(),
        date: dateEnd.getDay()
      }

      debug('dateStartObject : %o', dateStartObject)
      debug('dateEndObject : %o', dateEndObject)
      filter.date = { $gte: `${dateStartObject.year}-${dateStartObject.month}-${dateStartObject.date}`, $lte: `${dateEndObject.year}-${dateEndObject.month}-${dateEndObject.date}` }
    }
    if (filter.hasOwnProperty('institution')) {

    }
  }
  debug('Filter used : %o', filter)

  debug(excludedFileList)
  Report.find(filter).select(excludedFileList).populate('institution', 'name').populate('author', 'full_name').lean().exec(
    async (err, results) => {
      if (err) { return next(err) }
      debug(results)
      debug('Generating file')
      await exportToExcel.allReportYearToExcel(results, res)
    }
  )
}

exports.unverifiedReports = async (req, res, next) => {
  let excludedFileListYear = ''
  const questionListYear = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11']
  const pointListFour = ['a', 'b', 'c', 'd']

  for (let a = 0; a < questionListYear.length; a++) {
    for (let i = 0; i < 4; i++) {
      if (questionListYear[i] === 'question10') {
        for (let _b = 0; _b < 4; _b++) {
          excludedFileListYear += '-report.' + questionListYear[a] + pointListFour[i] + pointListFour[_b] + '.file'
        }
      } else {
        excludedFileListYear += '-report.' + questionListYear[a] + '.' + pointListFour[i] + '.file'
      }
      if (a != questionListYear.length) {
        excludedFileListYear += ' '
      }
    }
  }

  let excludedFileListSemester = ''
  const questionListSemester = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8']
  for (let a = 0; a < questionListSemester.length; a++) {
    excludedFileListSemester += '-report.' + questionListSemester[a] + '.file'
    if (a != questionListSemester.length) {
      excludedFileListSemester += ' '
    }
  }

  const query = { institution: req.user.institution }

  async.parallel({
    year: (callback) => {
      Report.find(query).select('validated').exec(callback)
    },
    semester: (callback) => {
      ReportSemester.find(query).select('validated').exec(callback)
    }
  }, (err, results) => {
    if (err) { return next(err) }
    debug(results)
    res.json(results)
  })
}
