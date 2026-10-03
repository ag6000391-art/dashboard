# Mumbai Local Train Time Table Extractor

This Python script extracts Mumbai Local Train Time Table from [TrainHelp.in/Mumbai-Local-Train-Time-Table](https://www.trainhelp.in/mumbai-local-train-time-table/) and saves the data into CSV files.


## Requirements
- Python 3.x
- requests
- pandas
- selectolax


You can install the required packages using pip: ``` pip install requests pandas selectolax ```


## Usage
1. Clone the repository or download the script directly.
2. Navigate to the directory containing the script.
3. Run the script using Python: ``` python extract.py ```


## How it works
The script performs the following steps:
1. Sends a request to the Mumbai Local Train Time Table page on TrainHelp.in.
2. Parses the HTML content using selectolax.
3. Identifies the target table using CSS selector.
4. Extracts the table data using pandas.
5. Saves each table as a separate CSV file in the `data` directory.


## File Structure
- `extractor.py`: Python script to extract the Mumbai Local Train Time Table.
- `data/`: Directory containing the extracted CSV files.

## Notes
- This script may be subject to changes if the structure of the website changes.
- Please ensure proper internet connectivity while running the script to fetch the latest data.
- For any issues or improvements, feel free to open an issue or submit a pull request.

## Disclaimer
This script is for educational and informational purposes only. The data extracted from TrainHelp.in is publicly available and the script does not modify or alter it in any way.