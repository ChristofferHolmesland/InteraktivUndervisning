const pythonQuestion =
	"class Punkt:\n" +
	"    def __init__(self, x, y):\n" +
	"        self.x = x\n" +
	"        self.y = y\n" +
	"\n" +
	"class Linje:\n" +
	"    def __init__(self, p1, p2):\n" +
	"        self.p1 = p1\n" +
	"        self.p2 = p2\n" +
	"\n" +
	"p1 = Punkt(0, 0)\n" +
	"p2 = Punkt(1, 1)\n" +
	"l1 = Linje(p1, p2)\n" +
	"\n" +
	"p1.x = 5\n" +
	"l1.p2.x = 5\n" +
	"\n";

module.exports = pythonQuestion;
