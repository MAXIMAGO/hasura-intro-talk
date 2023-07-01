@echo off
echo|set /P ="["> logbook.json
for /l %%x in (1, 1, 5) do (
    curl -vs "https://api.mockaroo.com/api/97f01370?count=5000&key=8ee195b0" >> logbook.json
    echo.>> logbook.json
)
curl -vs "https://api.mockaroo.com/api/97f01370?count=5000&key=8ee195b0" >> logbook.json
echo|set /P ="]">> logbook.json
