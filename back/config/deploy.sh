#!/bin/sh
path=$(cd $( dirname ${BASH_SOURCE[0]}) && pwd )/site_unseen_seed.sql;

cd //Users/lcordeno/Applications/MAMP/mysql/bin;

./mysql < $path -u root -PassWordle101!;

echo "Database deployed!"