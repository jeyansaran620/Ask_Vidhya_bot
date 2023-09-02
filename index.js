const { Composer } = require('micro-bot')

let Grades = require('./grades.json')

const chunks = (a, size) =>
    Array.from(
        new Array(Math.ceil(a.length / size)),
        (_, i) => a.slice(i * size, i * size + size)
    );
    
const bot = new Composer

bot.start((ctx) => {
    ctx.reply('Welcome to the demo bot \nhere you can see the some test features\n you can perform\n - /menu')
})

bot.command('menu',(ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id,'Explore our menu\nselect a grade',
    {
        reply_markup: {
            inline_keyboard: chunks(Object.values(Grades),3).map((chunk) => chunk.map((grade) => {
                return {
                    text: grade.gradeTitle,
                    callback_data:grade.gradeCode
                }
            }))
           }
    })
})

bot.action('back-to-menu',(ctx) => {
    ctx.deleteMessage()
    ctx.telegram.sendMessage(ctx.chat.id,'Explore our menu\nselect a grade',
    {
        reply_markup: {
            inline_keyboard: chunks(Object.values(Grades),4).map((chunk) => chunk.map((grade) => {
                return {
                    text: grade.gradeTitle,
                    callback_data:grade.gradeCode
                }
            }))
           }
    })
})


Object.values(Grades).map((grade) => {

    bot.action(grade.gradeCode, (ctx) => {
        ctx.deleteMessage()

        messageToSend =  'Good to see you champ\n' 
        messageToSend += `you are in \nGrade: <b>${grade.gradeTitle}</b>\n`
        messageToSend += '<b>select a subject</b>\n'

        ctx.telegram.sendMessage(ctx.chat.id,messageToSend,
        {
            parse_mode : 'HTML',
            reply_markup: {
                inline_keyboard: chunks(Object.values(grade.subjects),3).map((chunk) => 
                    chunk.map((subject) => {
                        return {
                            text: subject.subjectName,
                            callback_data: grade.gradeCode + subject.subjectCode
                        }
                    })
                ).concat([[{text: 'back to menu',callback_data:'back-to-menu'}]])
            }
        })
    })


    Object.values(grade.subjects).map((subject) => {

        bot.action(grade.gradeCode + subject.subjectCode, (ctx) => {
            ctx.deleteMessage()
            messageToSend =  'Good to see you champ\n' 
            messageToSend += `you are in \nGrade: <b>${grade.gradeTitle}</b>\n`
            messageToSend += `Subject: <b>${subject.subjectName}</b>\n\n`

            messageToSend += `<b>\Outcomes in this subject</b>\n`
            Object.values(subject.outcomes).map((outcome) => {
                messageToSend += `<b>outcome ${outcome.outcomeNo}</b>\n${outcome.value}\n\n`
            })

            messageToSend += '\n<b>select a outcome</b>'

            ctx.telegram.sendMessage(ctx.chat.id, messageToSend,
            {
                parse_mode : 'HTML',
                reply_markup: {
                    inline_keyboard: chunks(Object.values(subject.outcomes),3).map((chunk) => 
                        chunk.map((outcome) => {
                            return {
                                text: `outcome ${outcome.outcomeNo}`,
                                callback_data: grade.gradeCode + subject.subjectCode + outcome.outcomeNo
                            }
                        })
                    ).concat([[{text: `back to ${grade.gradeTitle}`,callback_data: grade.gradeCode}]])       
                }
            })
        })

        Object.values(subject.outcomes).map((outcome) => {

            bot.action(grade.gradeCode + subject.subjectCode + outcome.outcomeNo, (ctx) => {
                ctx.deleteMessage()
                messageToSend =  'Good to see you champ\n' 
                messageToSend += `you are in \nGrade: <b>${grade.gradeTitle}</b>\n`
                messageToSend += `Subject: <b>${subject.subjectName}</b>\n\n`
                messageToSend +=  'The outcome you selected\n' 
                messageToSend += `<b>outcome ${outcome.outcomeNo}</b>\n${outcome.value}\n\n`
                messageToSend += '<b>Resources in this outcome</b>\n'

                Object.values(outcome.resources).map((resource) => {
                    messageToSend += `<b>Resouce No:</b> ${resource.resourceNo}\n`
                    messageToSend += `<b>type:</b> ${resource.type}\n`
                    messageToSend += `<b>purpose:</b> ${resource.purpose}\n`
                    messageToSend += `<b>description:</b> ${resource.description}\n\n`
                })
    
                messageToSend += '\n<b>click a resource to start learning</b>'

                ctx.telegram.sendMessage(ctx.chat.id, messageToSend,
                    {
                        parse_mode : 'HTML',
                        reply_markup: {
                            inline_keyboard: chunks(Object.values(outcome.resources),3).map((chunk) => 
                                chunk.map((resource) => {
                                    return {
                                        text: `resource ${resource.resourceNo}`,
                                        url: resource.link
                                    }
                                })
                            ).concat([[{text: `back to ${subject.subjectName}`,callback_data: grade.gradeCode+subject.subjectCode }]])  
                        }
                    })
            })
    })
})

})

module.exports = bot