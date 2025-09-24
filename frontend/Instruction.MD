Копия дампа в контейнер в ручную
docker cp "C:\Users\Admin\Desktop\Fullstack\db\init\backup.sql" postgres-db:/backup.sql
Запуск вручную дампа
docker exec -it postgres-db psql -U postgres -d fastapi -f /backup.sql
Не работает с включенным VPN