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

- [`sf picklistutils generatefile`](#sf-picklistutils-generatefile)
- [`sf picklistutils updatevalues`](#sf-picklistutils-updatevalues)

## `sf picklistutils generatefile`

Summary of a command.

```
USAGE
  $ sf picklistutils generatefile -f <value> -a <value> -o <value> [--json] [--flags-dir <value>] [-n <value>] [-s <value>] [-e
    <value>] [--api-version <value>] [-l]

FLAGS
  -a, --field-api-name=<value>  (required) API Name of the field to extract values from (Account.myfield_c for custom
                                field). Use StandardValueSet name for standard fields (AccountType for standard field
                                Account.Type)
  -e, --eol=<value>             End of line to be used in the csv file. "\n" by default.
  -f, --output-file=<value>     (required) Path of the output file.
  -l, --include-columns-labels  Set to True if you want to include column labels.
  -n, --name=<value>            Description of a flag.
  -o, --target-org=<value>      (required) Username or alias of the target org. Not required if the `target-org`
                                configuration variable is already set.
  -s, --separator=<value>       Separator to be used in the csv file. Comma by default.
      --api-version=<value>     Override the api version used for api requests made by this command

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Summary of a command.

  More information about a command. Don't repeat the summary.

EXAMPLES
  $ sf picklistutils generatefile

FLAG DESCRIPTIONS
  -n, --name=<value>  Description of a flag.

    More information about a flag. Don't repeat the summary.
```

## `sf picklistutils updatevalues`

Updates picklist values from a csv file.

```
USAGE
  $ sf picklistutils updatevalues -a <value> -f <value> -o <value> [--json] [--flags-dir <value>] [-s <value>] [-e <value>]
    [--api-version <value>] [-l]

FLAGS
  -a, --field-api-name=<value>  (required) Field name to target (Account.myfield_c for custom field). Use
                                StandardValueSet name for standard fields (AccountType for standard field Account.Type)
  -e, --eol=<value>             End of line to be used in the csv file. "\n" by default.
  -f, --filename=<value>        (required) File containing new values.
                                Two columns csv file containing pairs label,value
  -l, --has-columns-labels      Set to true if the input file has columns labes, to ignore the first line.
  -o, --target-org=<value>      (required) Username or alias of the target org. Not required if the `target-org`
                                configuration variable is already set.
  -s, --separator=<value>       Separator to be used in the csv file. Comma by default.
      --api-version=<value>     Override the api version used for api requests made by this command

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Updates picklist values from a csv file.

  Updates picklist values from a csv file.
  To update a custom picklist field, using local values or a global value set, pass the full API field name.
  To update a standard picklist field, pass the StandardValueSet name.

EXAMPLES
  To update the Standard Picklist AccountType :
  $ sf picklistutils updatevalues -a AccountType
  To update the Custom Picklist (local or global) named myfield**c on Account object :
  $ sf picklistutils updatevalues -a Account.myfield**c
```

<!-- commandsstop -->
