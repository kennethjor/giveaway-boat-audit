init:
	npm install

compile:
	npx tsc

audit: compile
	date -u > audit.log
	time node build/audit.js 2>&1 | tee -a audit.log

clean:
	rm -R build
