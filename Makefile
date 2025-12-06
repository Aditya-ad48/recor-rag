create-zip:
	zip -r team_65.zip recor-rag/ queries-generation/ images/ simulated-real-query-system/ technical-report/ docker-compose.yml README.md .gitignore
	
upload-zip:
	gsutil -m cp team_65.zip gs://recor-rag