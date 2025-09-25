# Cache + Data Fetch

```
External request --> (my server, elsewhere)
    (my server, elsewhere) --> [this project] actix
        [this project] actix --query--> postgres

            actix <-no-- postgres
            actix ---------> falcon
            actix <--data--- falcon
            actix ---data--> postgres
            actix --query--> postgres
            actix <--no----- postgres

                halt and catch fire

        [this project] actix <--data--- postgres
    (my server, elsewhere) <-- [this project] actix

Response <-- (my server, elsewhere) 
```