/*
    Interpreter for single file python scripts.

    Instructions:
        Open python.html
        Write code in the text area
        Open webconsole and type "parseCode()"

    Features not supported:
        - List comprehension
        - Inner classes
        - Inner functions (Class functions are ok)
        - The standard library
        - Shared class variables
        - Class inheritance

    TODO: 
        - Lists
        - len() function
        - operators
            - is not (js !=)
        - Class instantiation inside expression
*/

let codeInput = document.getElementById("code");

codeInput.addEventListener("keydown", function(e) {
    // Only accept the Tab key
    if (e.key !== "Tab" && e.which !== "9") return;

    // Prevent shifting focus from the element
    e.preventDefault();

    // Add 4 spaces
    let tabSize = 4;
    let tabPosition = codeInput.selectionStart;
    let textWithSpaces = codeInput.value.substring(0, tabPosition);
    for (let i = 0; i < tabSize; i++) textWithSpaces += " ";
    textWithSpaces += codeInput.value.substring(tabPosition);

    codeInput.value = textWithSpaces;
    // Move cursor to the right position
    codeInput.selectionStart = tabPosition + tabSize;
    codeInput.selectionEnd = tabPosition + tabSize;
});

function parseCode() {
    return parse(codeInput.value);
}

function assignScope(object) {
    // Address -> Value
    object.data = [];
    // Name -> Address
    object.objects = new Map();
    // Name -> Scope
    object.functions = new Map();
    // Name -> Scope
    object.classes = new Map();
}

function parse(code) {
    let keyWords = ["def", "return", "class", "if"];
    let operators = [
        "and", "or", "!",
        "==", "!=", "<", ">", ">=", "<=", 
        "+", "-", "*", "/"
    ];

    let getNewStep = function() { 
        let newStep = {};
        assignScope(newStep);
        return newStep;
    };

    let steps = [];
    let currentStep = 0;
    let storedIndexes = [];
    steps[currentStep] = getNewStep();

    let handleKeyWord = function(scope, line, keyWord, lineNumber, lines) {
        if (keyWord == "def") {
            line = line.substring(4).split("(");
            let name = line[0];
            let args = line[1].substring(0, line[1].length - 2).split(",");
            for (let i = 0; i < args.length; i++) {
                args[i] = args[i].trim();
            }

            let length = 0;
            for (let i = lineNumber + 1; i < lines.length; i++) {
                if (lines[i].startsWith("    ") || lines[i].trim() == "") {
                    length += 1;
                } else break;
            }

            let start = lineNumber + 1;
            let end = start + length;

            let func = {
                name: name,
                args: args,
                code: lines.slice(start, end)
            };
            assignScope(func);

            scope.functions.set(name, func);
            return {
                type: "SkipLines",
                data: length
            };
        } else if (keyWord == "return") {
            return evaluateExpression(scope, line.substring(7));
        } else if (keyWord == "class") {
            let name = line.substring(6, line.length - 1);

            let length = 0;
            for (let i = lineNumber + 1; i < lines.length; i++) {
                if (lines[i].startsWith("    ") || lines[i].trim() == "") {
                    length += 1;
                    lines[i] = lines[i].slice(4);
                } else {
                    break;
                }
            }

            let start = lineNumber + 1;
            let end = start + length;

            let c = { 
                name: name,
                code: lines.slice(start, end)
            };
            assignScope(c);

            for (let i = 0; i < c.code.length; i++) {
                let r = parseLine(c, c.code[i], i, c.code, true);
                if (r !== undefined) {
                    if (r.type == "SkipLines") {
                        i += r.data;
                    }
                }
            }

            scope.classes.set(name, c);
            return {
                type: "SkipLines",
                data: length
            }
        } else if (keyWord == "if") {
            let lineNumbers = [];
            let expressions = [];
            let startIndent = 0;
            let endOfIf = 0;

            for (let i = lineNumber; i < lines.length; i++) {
                let t = lines[i].trim();
                if (t.startsWith("if")) {
                    lineNumbers.push(i);
                    expressions[i] = t.substring(3, t.length - 1);
                    startIndent = lines[i].indexOf("if");
                    continue;
                } else if (t.startsWith("elif")) {
                    lineNumbers.push(i);
                    expressions[i] = t.substring(5, t.length - 1);
                    continue;
                } else if (t.startsWith("else")) {
                    lineNumbers.push(i);
                    expressions[i] = "True";
                    continue;
                }

                let outOfIf = false;
                for (let j = 0; j < startIndent + 4; j++) {
                    if (lines[i].trim() == "") {
                        // Check if it's the last line and set
                        // endOfIf.
                        if (i == lines.length - 1) {
                            outOfIf = true;
                            endOfIf = i + 1;
                            lineNumbers.push(endOfIf);
                        }

                        break;
                    }

                    // Check if indent is ok
                    if (lines[i][j] !== " ") {
                        outOfIf = true;
                        endOfIf = i;
                        lineNumbers.push(endOfIf);
                        break;
                    }

                    // If indent is ok and we're at the last line
                    // set endOfIf
                    if (i == lines.length - 1) {
                        outOfIf = true;
                        endOfIf = i + 1;
                        lineNumbers.push(endOfIf);
                        break;
                    }
                }
                if (outOfIf) break;
            }

            for (let i = 0; i < lineNumbers.length - 1; i++) {
                let l = lineNumbers[i];
                let expr = expressions[l];
                let evaluated = evaluateExpression(scope, expr);

                if (evaluated == undefined || evaluated.type !== "Boolean") {
                    console.error("Something is wrong with the expression at line: " + l);
                    console.error(expr);
                    console.error(evaluated);
                    continue;
                }

                if (evaluated.data == false) continue;

                for (let j = l + 1; j < lineNumbers[i + 1]; j++) {
                    let r = parseLine(scope, lines[j], j, lines, false);
                    if (r !== undefined) {
                        if (r.type == "SkipLines") {
                            j += r.data;
                        } else {
                            return r;
                        }
                    }
                }

                break;
            }

            return {
                type: "SkipLines",
                // Subtracting 1 because the for loop surrounding parseLine
                // increments the line number value.
                data: lineNumbers[lineNumbers.length - 1] - lineNumbers[0] - 1
            };
        }
    };

    let instantiateClass = function(c, scope, args) {
        let object = {
            type: "Object",
        };
        assignScope(object);
        object.functions = c.functions;

        if (object.functions.has("__init__")) {
            // Add the object as the self argument
            args.unshift(object);
            callFunc(
                object.functions.get("__init__"),
                scope,
                args
            );
        }

        return object;
    }

    let callFunc = function(func, scope, args) {
        // Add arguments as local functions
        for (let i = 0; i < func.args.length; i++) {
            func.objects.set(func.args[i], func.data.length);
            func.data[func.data.length] = args[i];
        }

        // Run function code
        let data = undefined;
        for (let i = 0; i < func.code.length; i++) {
            let r = parseLine(func, func.code[i], i, func.code, false);
            if (r !== undefined) {
                if (r.type !== "SkipLines") {
                    data = r;
                    break;
                } else if (r.type == "SkipLines") {
                    i += r.data;
                }
            }
        }

        // Cleanup
        assignScope(func);
        return data;
    };


    let evaluateExpression = function(scope, expression) {
        let print = false;

        // Removes whitespace
        expression = expression.trim();

        // If the expression starts with ( and ends with ),
        // they can be removed, because they serve no purpose anymore
        // Example !(true and true) will result in
        // Operation: operand !, data (true and true)
        // (true and true) will be parsed as a function with name ""
        if (expression.startsWith("(") && expression.endsWith(")")) {
            expression = expression.slice(1, expression.length - 1);
        }

        // Check for base types
        if (!isNaN(Number(expression))) {
            if (print) console.log("base type");
            return { 
                data: Number(expression), 
                type: "Number" 
            };
        } else if (expression.startsWith("\"") && expression.endsWith("\"")) {
            if (print) console.log("base type");
            return {
                data: expression.substring(1, expression.length - 1),
                type: "String"
            };
        } else if (expression == "True") {
            if (print) console.log("base type");
            return {
                data: true,
                type: "Boolean"
            };
        } else if (expression == "False") {
            if (print) console.log("base type");
            return {
                data: false,
                type: "Boolean"
            };
        }

        // Check if its a variable
        if (scope.objects.has(expression)) {
            if (print) console.log("Variable");
            return scope.data[scope.objects.get(expression)];
        }

        // Check if its a variable belongig to an object
        if (expression.includes(".")) {
            let s = expression.split(".");
            let objectName = s[0];
            let propertyName = s[1];
            // Checks if the property contains a (, which means that its
            // a function call instead of property access.
            if (!propertyName.includes("(") && scope.objects.has(objectName)) {
                let objectAddr = scope.objects.get(objectName);
                let object = scope.data[objectAddr];
                // Check that the object actually has the property
                if (object.objects.has(propertyName)) {
                    if (print) console.log("Belongs to object");
                    let propertyAddr = object.objects.get(propertyName);
                    if (print) console.log(object.data[propertyAddr]);
                    return object.data[propertyAddr];
                }
            }
        }

        // 1 + abc(2, 3, 4, nils()) + nils()

        let isOperation = true;
        let name = ""
        // If the first character is !, then expression
        // is an operation where the result expression[1:]
        // should be inverted.
        if (expression.startsWith("!")) isOperation = true;
        // If the last character of the expression is a ),
        // then the expression might be a function call
        else if (expression[expression.length - 1] == ")") {
            // Check if the first ( closes the last ).
            let open = 0;
            let foundOpen = false;
            for (let i = 0; i < expression.length; i++) {
                if (expression[i] == "(") {
                    open++
                    foundOpen = true;
                } else if (expression[i] == ")") {
                    open--;
                }

                if (foundOpen && open == 0) {
                    isOperation = i != expression.length - 1;
                    break;
                } else if (!foundOpen) {
                    name += expression[i];
                }
            }
        }

        /*
            Check for function call or object instantiation
            Python doesn't support variables/functions/classes with the same
            name so it doesn't matter which order it is checked in. Scope (Local)
            objects are accessed before global (step) objects.
        */
        if (!isOperation) {
            if (print) console.log("Is function");
            // Parse and evaluate the arguments
            let startIndex = expression.indexOf("(") + 1;

            // TODO: Fixing class instantiation by only splitting at ,
            // if the open ( value == 0

            let args = expression.slice(startIndex, expression.length - 1).split(",");
            for (let i = 0; i < args.length; i++) {
                if (args[i] == "") {
                    args.splice(i, 1);
                    i--;
                } else {
                    args[i] = evaluateExpression(scope, args[i]);
                }
            }

            // Checks if the function belongs to class
            if (name.includes(".")) {
                let s = name.split(".");
                let objectAddr = scope.objects.get(s[0]);
                let object = scope.data[objectAddr];
                let funcName = s[1];
                // Add the self argument
                args.unshift(object);
                return callFunc(
                    object.functions.get(funcName),
                    scope,
                    args
                );
            }

            // Global function
            if (steps[currentStep].functions.has(name)) {
                let func = steps[currentStep].functions.get(name);
                return callFunc(func, scope, args);
            }

            // Global class
            if (steps[currentStep].classes.has(name)) {
                let c = steps[currentStep].classes.get(name);
                return instantiateClass(c, scope, args);
            }

            console.error("Returning nothing from something I thought was a function");
            console.error(expression);
            return;
        }

        if (print) console.log("Is operation");
        // The only valid expression left is an operation on two expressions
        let info = getOperationInfo(scope, expression);
        if (print) console.log(info);

        if (info.operator == "+") {
            if (info.operand1.type !== info.operand2.type) return;

            let result = {
                type: info.operand1.type
            }

            if (info.operand1.type == "Number" || info.operand1.type == "String") {
                result.data = info.operand1.data + info.operand2.data;
            }

            return result;
        } else if (info.operator == "-") {
            if (info.operand1.type !== info.operand2.type) return;

            let result = {
                type: info.operand1.type
            }

            if (info.operand1.type == "Number") {
                result.data = info.operand1.data - info.operand2.data;
            }

            return result;
        } else if (info.operator == "/") {
            if (info.operand1.type !== info.operand2.type) return;

            let result = {
                type: info.operand1.type
            }

            if (info.operand1.type == "Number") {
                result.data = info.operand1.data / info.operand2.data;
            }

            return result;
        } else if (info.operator == "*") {
            let result = {}

            if (info.operand1.type == "Number" && info.operand2.type == "Number") {
                result.data = info.operand1.data * info.operand2.data;
                result.type = "Number";
            } else if (info.operand1.type == "Number" && info.operand2.type == "String") {
                let data = "";
                for (let i = 0; i < info.operand1.data; i++) {
                    data += info.operand2.data;
                }
                result.data = data;
                result.type = "String";
            } else if (info.operand1.type == "String" && info.operand2.type == "Number") {
                let data = "";
                for (let i = 0; i < info.operand2.data; i++) {
                    data += info.operand1.data;
                }
                result.data = data;
                result.type = "String";
            }

            return result;
        } else if (info.operator == "==") {
            if (info.operand1.type !== info.operand2.type) {
                return {
                    type: "Boolean",
                    data: false
                };
            }

            return {
                type: "Boolean",
                data: (info.operand1.data === info.operand2.data)
            };
        } else if (info.operator == "!=") {
            if (info.operand1.type !== info.operand2.type) {
                return {
                    type: "Boolean",
                    data: true
                };
            }

            return {
                type: "Boolean",
                data: info.operand1.data !== info.operand2.data
            };
        } else if (info.operator == "is") {
            return {
                type: "Boolean",
                data: info.operand1 == info.operand2
            };
        } else if (info.operator == "<") {
            return {
                type: "Boolean",
                data: info.operand1.data < info.operand2.data
            };
        } else if (info.operator == ">") {
            return {
                type: "Boolean",
                data: info.operand1.data > info.operand2.data
            };
        } else if (info.operator == ">=") {
            return {
                type: "Boolean",
                data: info.operand1.data >= info.operand2.data
            };
        } else if (info.operator == "<=") {
            return {
                type: "Boolean",
                data: info.operand1.data <= info.operand2.data
            };
        } else if (info.operator == "and") {
            return {
                type: "Boolean",
                data: info.operand1.data == true && info.operand2.data == true
            };
        } else if (info.operator == "or") {
            return {
                type: "Boolean",
                data: info.operand1.data == true || info.operand2.data == true
            }
        } else if (info.operator == "!") {
            return {
                type: "Boolean",
                data: !info.operand.data
            };
        }
    };

    let getOperationInfo = function(scope, expression) {
        // The operator is the first element in the operators array
        // which is outside of ( and ). If the expression is surrouned
        // by (), they can be removed.
        if (expression.startsWith("(") && expression.endsWith(")")) {
            expression = expression.slice(1, expression.length - 1);
        }
        // Since the ! operation only have one operand, the loop won't detect
        // and evaluate the expression correctly
        else if (expression.startsWith("!")) {
            return {
                operand: evaluateExpression(scope, expression.slice(1)),
                operator: "!"
            };
        }


        let open = 0;
        for (let i = 0; i < expression.length; i++) {
            if (expression[i] == "(") {
                open++;
            } else if (expression[i] == ")") {
                open--;
            } else {
                if (open !== 0) continue;
                for (let o = 0; o < operators.length; o++) {
                    let operator = operators[o];
                    let testOperator = expression.slice(i, i + operator.length);
                    if (operator == testOperator) {
                        return {
                            operand1: evaluateExpression(scope, expression.slice(0, i)),
                            operand2: evaluateExpression(scope, expression.slice(i + operator.length)),
                            operator: operator
                        }
                    }
                }
            }
        }
    }

    let parseLine = function(scope, line, i, lines, skipIndents) {
        // Check for empty line
        if (line.trim() == "") return;

        // Check if the line starts with spaces, if it does
        // skip the line because it should have been handled by
        // a keyword handler.
        if (line.startsWith(" ") && skipIndents) return;
        line = line.trim();
        // Skip comments
        if (line.startsWith("#")) return;

        // Check if the line is a function or class definition
        for (let k = 0; k < keyWords.length; k++) {
            if (line.startsWith(keyWords[k])) {
                return handleKeyWord(scope, line, keyWords[k], i, lines);
            }
        }

        // Checks if the line is an assignment
        let variableName = "";
        let expr = "";
        for (let j = 0; j < line.length; j++) {
            if (line[j] == "=") {
                variableName = line.substring(0, j).trim();
                expr = line.substring(j + 1).trim();
            }
        }

        // If it's not an assignment, it can still be
        // a valid expression (i.e. function call).
        if (variableName === "") expr = line;

        let evaluated = evaluateExpression(scope, expr);

        // Object property
        if (variableName.includes(".")) {
            let s = variableName.split(".");
            let objectAddr = scope.objects.get(s[0]);
            let object = scope.data[objectAddr];
            let attribute = s[1];

            if (object.objects.has(attribute)) {
                let addr = object.objects.get(attribute);
                object.data[addr] = evaluated;
            } else {
                let addr = object.data.length;
                object.objects.set(attribute, addr);
                object.data[addr] = evaluated;
            }
        }
        // Global object
        else if (variableName !== "") {
            if (scope.objects.has(variableName)) {
                let addr = scope.objects.get(variableName);
                scope.data[addr] = evaluated;
            } else {
                let addr = scope.data.length;
                scope.objects.set(variableName, addr);
                scope.data[addr] = evaluated;
            }
        }
    };

    let lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let r = parseLine(steps[currentStep], line, i, lines, true);
        if (r !== undefined) {
            if (r.type == "SkipLines") {
                i += r.data;
            }
        }
    }

    return steps;
}

function util_checkIfArrayContainsAnyElement(arr, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (arr.indexOf(elements[i]) > -1) {
            return true;
        }
    }

    return false;
}


/*
    Examples of valid code that should run in this version

    # 1
    def add(a, b):
        c = a + b
        return c + 10 + 10

    a = 2
    b = 3

    f = add((b + 3) / a, 2) 

    # 2
    class MyClass:
    def __init__(self, a, b):
        self.c = a + b

    def assignF(self, a):
        self.f = a

    d = MyClass(2, 9)
    d.e = "Hei på deg"
    d.assignF(99)

    # 3
    class Point:
        def __init__(self, x, y):
            self.x = x
            self.y = y

        def translate(self, dx, dy):
            self.x = self.x + dx
            self.y = self.y + dy

    class Line:
        def __init__(self, from, to):
            self.p1 = from
            self.p2 = to

    a = Point(0, 0)
    b = Point(1, 1)

    c = Line(a, b)

    a.translate(10, 10)

    # 4
    def under10(num):
    if num < 10:
        return True
    else:
        return False

    class MyNumbers:
        def __init__(self, num1, num2):
            self.num1 = num1
            self.num2 = num2

        def atleastOneOver9(self):
            return !(under10(self.num1) and under10(self.num2))

    a = MyNumbers(9, 3)

    b = a.atleastOneOver9()

    a.num1 = 10

    c = a.atleastOneOver9()
*/