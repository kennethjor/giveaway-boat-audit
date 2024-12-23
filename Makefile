init:
	npm install

compile:
	npx tsc --declarationMap --outDir build/ *.ts

audit:
	npx ts-node audit.ts
