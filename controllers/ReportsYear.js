const async = require('async');
const debug = require('debug')('reportyear');
const { body, validationResult } = require('express-validator');

const Report = require('../models/report_year')

const handleFilter = (filter) => {
		const filterJson = JSON.parse(filter)
		return filterJson;
	}

const handleRange = (range) => {
	const rangeJson = JSON.parse(range)
	const [start, end] = rangeJson;
	const limitation = end-start+1;
	return [start,limitation];
}

const handleSort = (sort) => {
	const sortJson = JSON.parse(sort)
	const [resource, order] = sortJson;
	const orderLowerCase = order.toLowerCase()
	return sortOn={
		[resource]: [orderLowerCase]
	}
}

exports.set_header = (req, res, next) =>{
		Report.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}


exports.show_all = async (req, res, next) => {

	debug(Object.keys(req.query).length)

	if(Object.keys(req.query).length === 0){
		debug("No query")
		Report.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			res.json(results);
		}
		)	

	}else{
		debug("Query :");
		debug(req.query)
		let filter;
		let start, limitation;
		let sort;

		if(req.query.range != undefined){
			const range  = await handleRange(req.query.range);
			[start, limitation] = range;
		}

		if(req.query.filter != undefined){
			filter = await handleFilter(req.query.filter);
		}

		if(req.query.sort != undefined) {
			sort = handleSort(req.query.sort);
		}
		
		Report.find(filter).sort(sort).skip(start).limit(limitation).exec(
			(err, results) =>{
				res.json(results)
			})
	}
}

exports.show_one = (req, res, next) => {
	Report.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results.year_formatted);
			res.json(results);
		}
		)
}

exports.show_ten = async (req, res, next) => {
	let filter={};
	debug(req.query)

	if(req.query.filter != undefined){
		filter = await handleFilter(req.query.filter);
	}			
	async.parallel({
		data: (callback) => {
			Report.find(filter).populate('author').populate('institution').sort('year +1').limit(10).exec(callback)
		},
		count: (callback) => {
			Report.countDocuments(filter).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results)
		res.json(results);
	})
}


const addEmptyFilePropertyToBody = (report) => {
	debug('Add Empty')
	const pointListOne = ['a']
	const pointListTwo = ['a','b']
	const pointListThree = ['a','b','c']
	const pointListFour = ['a','b','c','d']
	
	const questionLengthOne = ['question9'] //alson question10.a, question10.b, question11
	const questionLengthTwo = ['question6','question11'] //also question 10.c
	const questionLengthThree = ['question1','question2','question4','question5','question7','question8']
	const questionLengthFour = ['question3']
	const questionList = ['question1','question2','question3','question4','question5','question6','question7','question8','question9','question10','question11',]

	const addEmptyObjectToQuestions = () =>{
		const reportObjectKey = Object.keys(report)
		debug('Filled Input %O',reportObjectKey)
		for(let a = 0; a< questionList.length; a++){	
			if(reportObjectKey.indexOf(questionList[a]) === -1){
				report[questionList[a]] = {}
				}
			}

		// debug(report)
	}

	const addEmptyObjectToQuestionsChild = () => {
		Object.keys(report).forEach( (questions, index) => {
			if(questionLengthOne.indexOf(questions) != -1){
				debug('Question category : Length One')
				if(questions === 'question9'){
					report[questions].file = {}
				}else{
					for(let a = 0; a < pointListOne.length; a++){
					// debug(`report.${questions}.${pointListOne[a]}`)
					if(!report[questions][pointListOne[a]]){
						// debug(pointListOne[a])
						report[questions][pointListOne[a]] = {}
						report[questions][pointListOne[a]].file = {}
						}
				}
				}
			}
				
			//if exist && length = 2 and for loop
			if(questionLengthTwo.indexOf(questions) != -1){
				debug('Question category : Length Two')
				for(let a = 0; a < pointListTwo.length; a++){
					// debug(`report.${questions}.${pointListTwo[a]}`)
					if(!report[questions][pointListTwo[a]]){
						// debug(pointListTwo[a])
						report[questions][pointListTwo[a]] = {}
						report[questions][pointListTwo[a]].file = {}
						}
				}
			}
				
			//if exist && length = 3 and for loop
			if(questionLengthThree.indexOf(questions) != -1){
				debug('Question category : Length Three')
				for(let a = 0; a < pointListThree.length; a++){
					// debug(`report.${questions}.${pointListTwo[a]}`)
					if(!report[questions][pointListThree[a]]){
						// debug(pointListTwo[a])
						report[questions][pointListThree[a]] = {}
						report[questions][pointListThree[a]].file = {}
						}
				}
			}

			//if exist && length = 4 and for loop
			if(questionLengthFour.indexOf(questions) != -1){
				debug('Question category : Length Four')
				for(let a = 0; a < pointListFour.length; a++){
					// debug(`report.${questions}.${pointListFour[a]}`)
					if(!report[questions][pointListFour[a]]){
						// debug(pointListFour[a])
						report[questions][pointListFour[a]] = {}
						report[questions][pointListFour[a]].file = {}
						}
				}
				// debug(report[questions])
			}
				

			//if question10
			if(questions === 'question10'){
				debug('Question Category 10') 
				//Assign empty letter branch
				const question10Key = Object.keys(report[questions])
				debug(question10Key)
				for(let a = 0; a < pointListThree.length; a++){
					debug('Branch 1')
					// debug(`report.${questions}.${pointListFour[a]}`)
					//Assigning Empty in reporty.question[_var] if not exist, also solve _a since a is first branch in object
					if(question10Key.indexOf(pointListThree[a]) === -1){
						debug('Empties made %o',a)
						report[questions][pointListThree[a]] = {}
					}
					// debug(`report.${questions}.${pointListThree[a]}`)
				}
					debug(report[questions])
				for(let a = 0; a< pointListThree.length; a++){
					debug('Branch 2')
					if(pointListThree[a] === 'a'){
						if(!report[questions][pointListThree[a]].file ){
							report[questions][pointListThree[a]].file = {}
							debug('a %O',report[questions][pointListThree[a]])
						}
					}
					if(pointListThree[a] === 'b'){
						for(let i = 0; i < pointListThree.length; i++){
							if(!report[questions][pointListThree[a]][pointListThree[i]] ){
								report[questions][pointListThree[a]][pointListThree[i]] = {}
								report[questions][pointListThree[a]][pointListThree[i]].file = {}
								debug('b %O',report[questions][pointListThree[a]])
							}
						}
					}
					if(pointListThree[a] === 'c'){
						for(let i = 0; i < pointListTwo.length; i++){
							if(!report[questions][pointListThree[a]][pointListTwo[i]] ){
								report[questions][pointListThree[a]][pointListTwo[i]] = {}
							}
							if(!report[questions][pointListThree[a]][pointListTwo[i]].file ){
								report[questions][pointListThree[a]][pointListTwo[i]].file = {}
							}
							debug('c %O',report[questions][pointListThree[a]][pointListTwo[i]])
						}
					}
				}
					
			debug('Question 10 %O',report[questions])
			}

		})
		// debug('Report : %O',report)
	}
	addEmptyObjectToQuestions()
	addEmptyObjectToQuestionsChild()
	debug(report)
	return report;
}

exports.create = [
	body('author').trim().escape().isLength({min:1}),
	body('totalSDM').trim().isLength({min:1}).isNumeric(),
	body('Institution'),
	body('year').toDate().optional({ checkFalsy: true }).isISO8601(),

	async (req, res, next) => {
		debug("Body : ")
		debug(req.body)
		const error = validationResult(req)
		if(!error.isEmpty()){
			debug(error)
			throw new Error();
		}else{
		
		const newFileInput = await addEmptyFilePropertyToBody(req.body.report)
		debug('New File Input : %O',newFileInput)

		const report = new Report({
			author: req.body.author,
			area: req.body.area,
			totalSDM: req.body.totalSDM,
			institution: req.body.institution,
			year: req.body.year,
			validated: req.body.validated,
			report: {
				question1: {
					a: {
						information: newFileInput.question1.a.information,
						file: {
							title: newFileInput.question1.a.file.title,
							src: newFileInput.question1.a.file.src,
						},
					},
					b: {
						information: newFileInput.question1.b.information,
						file: {
							title: newFileInput.question1.b.file.title,
							src: newFileInput.question1.b.file.src,
						},
					},
					c: {
						information: newFileInput.question1.c.information,
						file: {
							title: newFileInput.question1.c.file.title,
							src: newFileInput.question1.c.file.src,
						}
					},
				},
				question2: {
					a: {
						information: newFileInput.question2.a.information,
						file: {
							title: newFileInput.question2.a.file.title,
							src: newFileInput.question2.a.file.src,
						}
					},
					b: {
						information: newFileInput.question2.b.information,
						file: {
							title: newFileInput.question2.b.file.title,
							src: newFileInput.question2.b.file.src,
						}
					},
					c: {
						information: newFileInput.question2.c.information,
						file: {
							title: newFileInput.question2.c.file.title,
							src: newFileInput.question2.c.file.src,
						}
					},
				},
				question3: {
					a: {
						information: newFileInput.question3.a.information,
						file: {
							title: newFileInput.question3.a.file.title,
							src: newFileInput.question3.a.file.src,
						}
					},
					b: {
						information: newFileInput.question3.b.information,
						file: {
							title: newFileInput.question3.b.file.title,
							src: newFileInput.question3.b.file.src,
						}
					},
					c: {
						information: newFileInput.question3.c.information,
						file: {
							title: newFileInput.question3.c.file.title,
							src: newFileInput.question3.c.file.src,
						}
					},
					d: {
						information: newFileInput.question3.d.information,
						file: {
							title: newFileInput.question3.d.file.title,
							src: newFileInput.question3.d.file.src,
						}
					},
				},
				question4: {
					a: {
						information: newFileInput.question4.a.information,
						file: {
							title: newFileInput.question4.a.file.title,
							src: newFileInput.question4.a.file.src,
						}
					},
					b: {
						information: newFileInput.question4.b.information,
						file: {
							title: newFileInput.question4.b.file.title,
							src: newFileInput.question4.b.file.src,
						}
					},
					c: {
						information: newFileInput.question4.c.information,
						file: {
							title: newFileInput.question4.c.file.title,
							src: newFileInput.question4.c.file.src,
						}
					},
				},
				question5: {
					a: {
						information: newFileInput.question5.a.information,
						file: {
							title: newFileInput.question5.a.file.title,
							src: newFileInput.question5.a.file.src,
						}
					},
					b: {
						information: newFileInput.question5.b.information,
						file: {
							title: newFileInput.question5.b.file.title,
							src: newFileInput.question5.b.file.src,
						}
					},
					c: {
						information: newFileInput.question5.c.information,
						file: {
							title: newFileInput.question5.c.file.title,
							src: newFileInput.question5.c.file.src,
						}
					},
				},
				question6: {
					a: {
						information: newFileInput.question6.a.information,
						file: {
							title: newFileInput.question6.a.file.title,
							src: newFileInput.question6.a.file.src,
						}
					},
					b: {
						information: newFileInput.question6.b.information,
						file: {
							title: newFileInput.question6.b.file.title,
							src: newFileInput.question6.b.file.src,
						}
					},
				},
				question7: {
					a: {
						information: newFileInput.question7.a.information,
						file: {
							title: newFileInput.question8.a.file.title,
							src: newFileInput.question8.a.file.src,
						}
					},
					b: {
						information: newFileInput.question7.b.information,
						file: {
							title: newFileInput.question8.b.file.title,
							src: newFileInput.question8.b.file.src,
						}
					},
					c: {
						information: newFileInput.question7.c.information,
						file: {
							title: newFileInput.question8.c.file.title,
							src: newFileInput.question8.c.file.src,
						}
					},
				},
				question8: {
					a: {
						information: newFileInput.question8.a.information,
						file: {
							title: newFileInput.question8.a.file.title,
							src: newFileInput.question8.a.file.src,
						}
					},
					b: {
						information: newFileInput.question8.b.information,
						file: {
							title: newFileInput.question8.b.file.title,
							src: newFileInput.question8.b.file.src,
						}
					},
					c: {
						information: newFileInput.question8.c.information,
						file: {
							title: newFileInput.question8.c.file.title,
							src: newFileInput.question8.c.file.src,
						}
					},
				},
				question9: {
					information: newFileInput.question9.information,
					file: {
						title: newFileInput.question9.file.title,
						src: newFileInput.question9.file.src,
					},
				},

				question10: {
					a: {
						information: newFileInput.question10.a.information,
						file: {
							title: newFileInput.question10.a.file.title,
							src: newFileInput.question10.a.file.src,
						}
					},
					b: {
							a: {
								information: newFileInput.question10.b.a.information,
								file: {
									title: newFileInput.question10.b.a.file.title,
									src: newFileInput.question10.b.a.file.src,
								}
							},
							b: {information: newFileInput.question10.b.b.information},
							c: {information: newFileInput.question10.b.c.information},
					},
					c: {
							a: {
								information: newFileInput.question10.c.a.information,
								file: {
									title: newFileInput.question10.c.a.file.title,
									src: newFileInput.question10.c.a.file.src,
								}
							},
							b: {
								information: newFileInput.question10.c.b.information,
								file: {
									title: newFileInput.question10.c.b.file.title,
									src: newFileInput.question10.c.b.file.src,
								}
							}
					}
				},
				question11: {
					a: {
						information: newFileInput.question11.a.information,
						file: {
							title: newFileInput.question11.a.file.title,
							src: newFileInput.question11.a.file.src,
						}
					},
					b: {information: newFileInput.question11.b.information},
				},
			}
		})
				debug(report)
				Report.create(report, (err, results) =>{
					if(err){return next(err);}
					// debug(results)
					// res.send("Successfully created per Year Report");
					res.send(results);
				})
		}
	}
]

exports.update = [
	body('author'),
	body('total', "total").trim().isLength({min:1}).isNumeric(),
	body('area',"area").trim().isLength({min:1}).isNumeric(),
	body('year',"year").toDate().optional({ checkFalsy: true }).isISO8601(),

	(req, res, next) => {
		// debug(req.body)
		debug(req.body.year)
		const error = validationResult(req)
		if(!error.isEmpty()){
			debug(error.errors)
			throw new Error();
		}else{
			
				const report = new Report({
					_id: req.params.id,
					author: req.body.author,
					area: req.body.area,
					total: req.body.total,
					year: req.body.year,
					report: {
						question1: {
							a: {
								information: req.body.report.question1.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.src,
								},
							},
							b: {
								information: req.body.report.question1.b.information,
								file: {
									title: req.body.report.question1.b.file.title,
									src: req.body.report.question1.b.file.src,
								},
							},
							c: {
								information: req.body.report.question1.c.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question2: {
							a: {
								information: req.body.report.question2.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
								information: req.body.report.question2.b.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							c: {
								information: req.body.report.question2.c.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question3: {
							a: {
								information: req.body.report.question3.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
								information: req.body.report.question3.b.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							c: {
								information: req.body.report.question3.c.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							d: {
								information: req.body.report.question3.d.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question4: {
							a: {
								information: req.body.report.question4.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
								information: req.body.report.question4.b.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							c: {
								information: req.body.report.question4.c.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question5: {
							a: {
								information: req.body.report.question5.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
								information: req.body.report.question5.b.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							c: {
								information: req.body.report.question5.c.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question6: {
							a: {
								information: req.body.report.question6.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
								information: req.body.report.question6.b.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question7: {
							a: {
								information: req.body.report.question7.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
								information: req.body.report.question7.b.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							c: {
								information: req.body.report.question7.c.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question8: {
							a: {
								information: req.body.report.question8.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
								information: req.body.report.question8.b.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							c: {
								information: req.body.report.question8.c.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
						},
						question9: {
							information: req.body.report.question9.information,
							file: {
								title: req.body.report.question,
								src: req.body.report.question,
							},
						},

						question10: {
							a: {
								information: req.body.report.question10.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {
									a: {
										information: req.body.report.question10.b.a.information,
										file: {
											title: req.body.report.question1.a.file.title,
											src: req.body.report.question1.a.file.title,
										}
									},
									b: {information: req.body.report.question10.b.b.information},
									c: {information: req.body.report.question10.b.c.information},
							},
							c: {
									a: {
										information: req.body.report.question10.c.a.information,
										file: {
											title: req.body.report.question1.a.file.title,
											src: req.body.report.question1.a.file.title,
										}
									},
									b: {
										information: req.body.report.question10.c.b.information,
										file: {
											title: req.body.report.question1.a.file.title,
											src: req.body.report.question1.a.file.title,
										}
									}
							}
						},
						question11: {
							a: {
								information: req.body.report.question11.a.information,
								file: {
									title: req.body.report.question1.a.file.title,
									src: req.body.report.question1.a.file.title,
								}
							},
							b: {information: req.body.report.question11.b.information},
						},
					}
				})
				debug(report)
				Report.findByIdAndUpdate(req.params.id, report, (err, results) =>{
					if(err){return (next(err));}
					debug(results)
					// res.send("Successfully updated per Year Report");
					res.send(results);
				})
		}
	}
]

exports.delete = (req, res, next) => {
	Report.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		// res.send("Sucessfully deleted per Year Report");
		res.json(results);
	})
}

// const oneLetter = ['a']
// 	const twoLetter = ['a','b']
// 	const threeLetter = ['a','b','c']
// 	const fourLetter = ['a','b','c','d'] 
// 	const question = ['question1','question2','question3','question4','question5','question6','question7','question8','question9','question10','question11']
// 	const questionA = ['question1','question2','question4','question5','question7','question8']
// 	const questionB = ['question3']
// 	const questionC = ['question6']
// 	const questionD = ['question9']
// 	const questionE = ['question10']
// 	const questionF = ['question11']

// 	const createdQuestion = Object.keys(body)
// 	debug(createdQuestion)
// 	const diffQuestion = question.filter((x) => !createdQuestion.includes(x))
// 	debug(diffQuestion)

	
	
// 	for(let a = 0; a < question.length; a++){
// 		if(questionA.indexOf(question[a]) != -1 ){
// 			body[question[a]] = {}
// 			for(let i = 0; i < threeLetter.length; i++){
// 				body[question[a]][threeLetter[i]] = {}
// 				body[question[a]][threeLetter[i]].file = {}
// 			}
// 		}
// 		if(questionB.indexOf(question[a]) != -1){
// 			body[question[a]] = {}
// 			for(let i = 0; i < fourLetter.length; i++){
// 				body[question[a]][fourLetter[i]] = {}
// 				body[question[a]][fourLetter[i]].file = {}
// 			}
// 		}
// 		if(questionC.indexOf(question[a]) != -1){
// 			body[question[a]] = {}
// 			for(let i = 0; i < twoLetter.length; i++){
// 				body[question[a]][twoLetter[i]] = {}
// 				body[question[a]][twoLetter[i]].file = {}
// 			}
// 		}
// 		if(questionD.indexOf(question[a]) != -1){
// 			body[question[a]] = {}
// 			body[question[a]].file = {}
// 		}

// 		if(questionE.indexOf(question[a]) != -1){
// 			body[question[a]] = {}
// 			for(let i = 0; i < threeLetter.length; i++){
// 				if(threeLetter[i] === threeLetter[0]){
// 					body[question[a]][threeLetter[i]] = {}
// 					body[question[a]][threeLetter[i]].file = {}
// 				}
// 				//B
// 				if(threeLetter[i] === threeLetter[1]){
// 					body[question[a]][threeLetter[i]] = {}
// 					for(let n = 0; n < threeLetter.length; n++){
// 						body[question[a]][threeLetter[i]][threeLetter[n]] = {}
// 						body[question[a]][threeLetter[i]][threeLetter[n]].file = {}
// 					}
// 				}
// 				//C
// 				if(threeLetter[i] === threeLetter[2]){
// 					body[question[a]][threeLetter[i]] = {}
// 					for(let n = 0; n < twoLetter.length; n++){
// 						body[question[a]][threeLetter[i]][twoLetter[n]] = {}
// 						body[question[a]][threeLetter[i]][twoLetter[n]].file = {}
// 					}
// 				}
				
				
// 			}
// 		}
// 		if(questionF.indexOf(question[a]) != -1){
// 			body[question[a]] = {}
// 			for(let i = 0; i < twoLetter.length; i++){
// 				body[question[a]][twoLetter[i]] = {}
// 				body[question[a]][twoLetter[i]].file = {}
// 				if(i == 1){
// 					body[question[a]][twoLetter[i]] = {}
// 				}
// 			}
// 		}
// 	}