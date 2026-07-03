-- scripts/init-db.sql
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'fleet_management_db')
BEGIN
  CREATE DATABASE fleet_management_db
END
GO