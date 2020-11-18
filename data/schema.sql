drop table if exists exam;

create table exam (
    id serial primary key,
    image text,
    patronus varchar(100),
    alive varchar(25)
)