var fs = require("fs")
var mkdirp = require("mkdirp")
var path = require("path")
var test = require("./_test")
var klaw = require("../")
var fixtures = require("./fixtures")

test("should not return files on nofile", function (t, testDir) {
	fixtures.forEach(function (f) {
		f = path.join(testDir, f)
		var dir = path.dirname(f)
		mkdirp.sync(dir)
		fs.writeFileSync(f, path.basename(f, path.extname(f)))
	})

	var items = []

	klaw(testDir, {nofile: true})
	.on("data", function (item) {
		items.push(item.path)
	})
	.on("error", t.end)
	.on("end", function () {
		var expected = [
			'',
			'a',
			'h',
			'a/b',
			'h/i',
			'a/b/c',
			'h/i/j',
		]

		expected = expected.map(function (item) {
			return path.join(testDir, item)
		})

		items.forEach(function(element) {
			if (fs.lstatSync(element).isFile()) {
				t.fail("Items should contain no files");
			}
		});

		console.log(items);
		console.log(expected);
		t.deepEqual(items, expected, "Should not return too many items")
		t.end()
	})
})
