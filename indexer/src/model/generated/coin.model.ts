import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
  ManyToOne as ManyToOne_,
  OneToMany as OneToMany_,
} from "typeorm";
import * as marshal from "./marshal";
import { Factory } from "./factory.model";
import { AccountBalance } from "./accountBalance.model";
import { Transfer } from "./transfer.model";

@Entity_()
export class Coin {
  constructor(props?: Partial<Coin>) {
    Object.assign(this, props);
  }

  /**
   * Coin address
   */
  @PrimaryColumn_()
  id!: string;

  @Index_()
  @Column_("text", { nullable: false })
  memeId!: string;

  @Column_("text", { nullable: false })
  name!: string;

  @Column_("text", { nullable: false })
  symbol!: string;

  @Column_("int4", { nullable: false })
  decimals!: number;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  initialSupply!: bigint;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  maxSupply!: bigint;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  circulatingSupply!: bigint;

  @Column_("text", { nullable: true })
  website!: string | undefined | null;

  @Column_("text", { nullable: true })
  telegram!: string | undefined | null;

  @Column_("text", { nullable: true })
  twitter!: string | undefined | null;

  @Column_("text", { nullable: true })
  discord!: string | undefined | null;

  @Column_("text", { nullable: true })
  tokenomics!: string | undefined | null;

  @Column_("text", { nullable: false })
  description!: string;

  @Column_("text", { nullable: true })
  image!: string | undefined | null;

  @Column_("text", { array: true, nullable: false })
  screenshots!: string[];

  @Column_("text", { array: true, nullable: false })
  admins!: string[];

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  distributed!: bigint;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  minted!: bigint;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  burned!: bigint;

  @Column_("int4", { nullable: false })
  holders!: number;

  @Index_()
  @ManyToOne_(() => Factory, { nullable: true })
  factory!: Factory;

  @Column_("text", { nullable: false })
  createdBy!: string;

  @Index_()
  @Column_("timestamp with time zone", { nullable: false })
  timestamp!: Date;

  @OneToMany_(() => AccountBalance, (e) => e.coin)
  balances!: AccountBalance[];

  @OneToMany_(() => Transfer, (e) => e.coin)
  transfers!: Transfer[];
}
