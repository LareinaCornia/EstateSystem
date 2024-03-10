# 房地产销售数据管理系统
打开pgAdmin，在PostgreSQL服务器下新建一个名为estate的数据库，然后以下SQL查询语句：
```
create table estates(
    eid char(6) primary key,
    ename varchar(15) unique,
    address varchar(15) unique
);

create table costumers(
    cid char(6) primary key,
    cname varchar(4),
    phone char(11) unique,
    sex char(1) check (sex in ('女','男')),
    age int check ( age > 18)
);

create table sales(
    eid char(6),
    cid char(6),
    saledate date,
    price decimal(10,2),
    foreign key (eid) references estates(eid),
    foreign key (cid) references costumers(cid)
);

create or replace function se() returns trigger as $$
begin 
    if not exists (select 1 from estates where eid = NEW.eid) then
        raise exception '请勿记录不存在的楼盘，请先建设新的楼盘';
    end if;
    RETURN NEW;
end;
$$ language plpgsql;

create trigger se_trigger
before insert on sales
for each row
execute function se();


create or replace function sc() returns trigger as $$
begin 
    if not exists (select 1 from costumers where cid = NEW.cid) then
        raise exception '请勿记录不存在的客户，请先建立新的客户档案';
    end if;
    RETURN NEW;
end;
$$ language plpgsql;

create trigger sc_trigger
before insert on sales
for each row
execute function sc();
```

在终端中打开 /estatesystem/backend文件夹，建立数据库连接，然后运行后端文件
```
npm init 
pg_ctl start -D "C:\Program Files\PostgreSQL\15\data"
node server.js
```
在浏览器中打开前端网页文件，即可使用房地产销售数据管理系统：
```
file://estatesystem/frontend/index.html
```

