# sfdx-picklist-utils

[![NPM](https://img.shields.io/npm/v/sfdx-picklist-utils.svg?label=sfdx-picklist-utils)](https://www.npmjs.com/package/sfdx-picklist-utils) [![Downloads/week](https://img.shields.io/npm/dw/sfdx-picklist-utils.svg)](https://npmjs.org/package/sfdx-picklist-utils) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/sfdx-picklist-utils/main/LICENSE.txt)

## Install

```
sf plugins install sfdx-picklist-utils
```

## Display help

```
sf picklistutils updatevalues -h
```

## Usage

This plugins provides commands to help users when updating values in piclist fields, especially chen labels and API values are different.

## Commands

<!-- commands -->

- [`sf picklistutils updatevalues`](#sf-picklistutils-updatevalues)

## `sf picklistutils updatevalues`

Update values in the targeted field based on labels and values in an input csv file.

```
USAGE
  $ sf picklistutils updatevalues -a <value> -f <value> -o <value> [--json] [--flags-dir <value>] [-s <value>] [-e <value>] [--api-version <value>] [-l]

FLAGS
  -a, --fieldapiname=<value>  (required) Field name to target (Account.myfield_c for custom field). Use StandardValueSet name for standard
                              fields (AccountType for standard field Account.Type)
  -e, --eol=<value>           End of line to be used in the csv file. "\n" by default.
  -f, --filename=<value>      (required) File containing new values.
                              Two columns csv file containing pairs label,value
  -l, --has-columns-labels    Set to true if the input file has columns labes, to ignore the first line.
  -o, --target-org=<value>    (required) Username or alias of the target org. Not required if the `target-org` configuration variable is
                              already set.
  -s, --separator=<value>     Separator to be used in the csv file. Comma by default.
      --api-version=<value>   Override the api version used for api requests made by this command


GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Update picklist values based on a csv file.
  To target a field named mypicklist__c on Account object, use Account.mypicklist__c. Works on local and global picklists.

  To target a standard field based on a standard value set, for example Account.Type, use AccountType. You can find Standard Values Sets in Salesforce Help : https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/standardvalueset_names.htm

EXAMPLES
  Import a file named newValues.csv into a custom field named mypicklist__c on Account :
  $ sf picklistutils updatevalues --fieldapiname=Account.mypicklist__c filename=newValues.csv --target-org=MYORG

  Import a file named newValues.csv into a custom field named mypicklist__c on Account, and ignore the first line of the csv file, containing columns labels :
  $ sf picklistutils updatevalues --fieldapiname=Account.mypicklist__c filename=newValues.csv -l --target-org=MYORG

  Import a file named newValues.csv into a standard field named Type on Account, and ignore the first line of the csv file, containing columns labels :
  $ sf picklistutils updatevalues --fieldapiname=AccountType filename=newValues.csv -l --target-org=MYORG

```

- [`sf picklistutils generatefile`](#sf-picklistutils-generatefile)

## `sf picklistutils generatefile`

Generates a csv file with labels and values from the targeted field.

```
USAGE
  $ sf picklistutils generatefile -f <value> -a <value> -o <value> [--json] [--flags-dir <value>] [-n <value>] [-s <value>] [-e <value>] [--api-version <value>] [-l]

FLAGS
  -a, --field-api-name=<value>  (required) API Name of the field to extract values from.
  -e, --eol=<value>             End of line to be used in the csv file. "\n" by default.
  -f, --output-file=<value>     (required) Path of the output file.
  -l, --include-columns-labels  Set to True if you want to include column labels.
  -n, --name=<value>            Description of a flag.
  -o, --target-org=<value>      (required) Username or alias of the target org. Not required if the `target-org` configuration variable is already set.
  -s, --separator=<value>       Separator to be used in the csv file. Comma by default.
      --api-version=<value>     Override the api version used for api requests made by this command

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Generate a csv file from labels and values from the targeted field.

  To target a field named mypicklist__c on Account object, use Account.mypicklist__c. Works on local and global picklists.

  To target a standard field based on a standard value set, for example Account.Type, use AccountType. You can find Standard Values Sets in Salesforce Help : https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/standardvalueset_names.htm

EXAMPLES
  Generate a file named output.csv from values of a custom field named mypicklist__c on Account :
  $ sf picklistutils generatefield --field-api-name=Account.mypicklist__c output-file=output.csv --target-org=MYORG

  Generate a file named output.csv, with columns names as 1st line, from values of a custom field named mypicklist__c on Account :
  $ sf picklistutils generatefield --field-api-name=Account.mypicklist__c output-file=output.csv --target-org=MYORG -l

  Generate a file named output.csv, with columns names as 1st line, from values of a standard field named Type on Account :
  $ sf picklistutils generatefield --field-api-name=AccountType output-file=output.csv --target-org=MYORG -l

```

<!-- commandsstop -->
