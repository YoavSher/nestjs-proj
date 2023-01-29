import { EntitySchema } from "typeorm"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"


const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mediumclone',
    username: 'mediumclone',
    password: '123',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
}

export default config