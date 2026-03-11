module.exports = class Data1732616901217 {
    name = 'Data1732616901217'

    async up(db) {
        await db.query(`ALTER TABLE "coin" ADD "meme_id" text NOT NULL default ''`)
        await db.query(`CREATE INDEX "IDX_d82e6bc53ac88872653f4aeabd" ON "coin" ("meme_id") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "coin" DROP COLUMN "meme_id"`)
        await db.query(`DROP INDEX "public"."IDX_d82e6bc53ac88872653f4aeabd"`)
    }
}
