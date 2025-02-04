import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class User {

 @PrimaryGeneratedColumn()
 id: number;

 @Column('text',{nullable:true})
 firstName: string;

 @Column('text',{nullable:true})
 lastName: string;
 
 @Column('integer',{nullable:true})
 age: number;
}
