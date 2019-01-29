const functions = {
    calculateQuizCode: function(quizzes) {
        let keys = Array.from(quizzes.keys());
        let possibleCodes = [];
        for(let i = 0; i < 10000; i++){
            if (!keys.includes(i)) {
                possibleCodes.push(i);
            }
        }
        
        let code = possibleCodes[Math.floor(Math.random() * possibleCodes.length)].toString();

        return code.padStart(4, "0");
    }
}

module.exports.functions = functions;