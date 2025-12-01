# First do this

## Step 1: Naming

Rename your service 
Set the name in activate.sh
Set service name in uninstall.sh


## Step 2: Setup

./install.sh


# Systemctl Notes

## Start / Stop

systemctl --user stop foobar.service

## Block (mask / unmask)

systemctl --user mask foobar.service


# Ideas + Todos

## Move tools to ./scripts directory

A lot of this is internal tools and not interface. 


## Parametrize this whole thing by name.

Install can ask for a name as an arg. 
It can export that env var and let everything else expect it. 


