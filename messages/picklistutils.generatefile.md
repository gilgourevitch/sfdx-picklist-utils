# summary

Generates a csv file with 2 columns "Label" and "API Name". You can then update the csv file, and use it to re-import changes directly.

# description

Generates a csv file with 2 columns "Label" and "API Name". You can then update the csv file, and use it to re-import changes directly.

# flags.output-file.summary

Path of the output file.

# flags.field-api-name.summary

API Name of the field to extract values from (Account.myfield_c for custom field). Use StandardValueSet name for standard fields (AccountType for standard field Account.Type)

# flags.field-api-name.description

API Name of the field to extract values from (Account.myfield_c for custom field). Use StandardValueSet name for standard fields (AccountType for standard field Account.Type)

# flags.separator.summary

Separator to be used in the csv file. Comma by default.

# flags.eol.summary

End of line to be used in the csv file. "\n" by default.

# flags.include-columns-labels.summary

Set to True if you want to include column labels.

# examples

Generate a file named output.csv from values of a custom field named mypicklist**c on Account :
$ sf picklistutils generatefield --field-api-name=Account.mypicklist**c output-file=output.csv --target-org=MYORG

Generate a file named output.csv, with columns names as 1st line, from values of a custom field named mypicklist**c on Account :
$ sf picklistutils generatefield --field-api-name=Account.mypicklist**c output-file=output.csv --target-org=MYORG -l

Generate a file named output.csv, with columns names as 1st line, from values of a standard field named Type on Account :
$ sf picklistutils generatefield --field-api-name=AccountType output-file=output.csv --target-org=MYORG -l
