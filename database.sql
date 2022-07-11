create table team (
    id uuid not null,
    acro VARCHAR(3) not null,
    name text not null,
    city text not null,
    country text not null,
    primary key (id)
);
create table championship (
    id uuid not null,
    name text not null,
    season INTEGER not null,
    inserted boolean not null default 'f',
    closed boolean not null default 'f',
    country text not null,
    primary key (id)
);
create table match (
    id uuid not null,
    championship_id uuid not null references championship(id),
    house_id uuid not null references team(id),
    visitor_id uuid not null references team(id),
    house_goals INTEGER not null default 0,
    visitor_goals INTEGER not null default 0,
    "start" TIMESTAMPTZ not null,
    "end" TIMESTAMPTZ not null,
    inserted boolean not null default 'f',
    fullfilled boolean not null default 'f',
    closed boolean not null default 'f',
    primary key (id)
);