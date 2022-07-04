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
    champ_id INTEGER,
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
    match_id INT,
    primary key (id)
);
create table championship_team (
    championship_id uuid not null references championship(id),
    team_id uuid not null references team(id),
    primary key (championship_id, team_id)
);
create view to_insert_view as
select c.champ_id as champ_id,
    h.acro as house,
    v.acro as visitor,
    m.start as start,
    m.id as id
from match as m
    inner join championship as c on c.id = m.championship_id
    inner join team as h on h.id = m.house_id
    inner join team as v on v.id = m.visitor_id
where m.inserted = false
    and m.closed = false;
create view to_fullfill_view as
select c.champ_id as champ_id,
    m.house_goals as house,
    m.visitor_goals as visitor,
    m.id as id,
    m.match_id as match_id
from match as m
    inner join championship as c on c.id = m.championship_id
where m.inserted = true
    and m.closed = false
    and m.fullfilled = true;