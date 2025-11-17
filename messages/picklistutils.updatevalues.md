# summary

Updates picklist values from a csv file.

# description

Updates picklist values from a csv file.
To update a custom picklist field, using local values or a global value set, pass the full API field name.
To update a standard picklist field, pass the StandardValueSet name.

# flags.fieldapiname.summary

Field name to target (Account.myfield_c for custom field). Use StandardValueSet name for standard fields (AccountType for standard field Account.Type)

# flags.fieldapiname.description

Field name to target (Account.myfield_c for custom field). Use StandardValueSet name for standard fields (AccountType for standard field Account.Type)

# flags.filename.summary

File containing new values.
Two columns csv file containing pairs label,value

# flags.filename.description

File containing new values.
Two columns csv file containing pairs label,value

# flags.separator.summary

Separator to be used in the csv file. Comma by default.

# flags.separator.description

Separator to be used in the csv file. Comma by default.

# flags.eol.summary

End of line to be used in the csv file. "\n" by default.

# flags.eol.description

End of line to be used in the csv file. "\n" by default.

# examples

To update the Standard Picklist AccountType :
sf picklistutils updatevalues -a AccountType

To update the Custom Picklist (local or global) named myfield**c on Account object :
sf picklistutils updatevalues -a Account.myfield**c

# info.hello

info

# flags.has-columns-labels.summary

Set to true if the input file has columns labes, to ignore the first line.
