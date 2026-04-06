"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("tasks");

    if (!table.createdAt) {
      await queryInterface.addColumn("tasks", "createdAt", {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    if (!table.updatedAt) {
      await queryInterface.addColumn("tasks", "updatedAt", {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE "tasks"
      SET "createdAt" = CURRENT_TIMESTAMP
      WHERE "createdAt" IS NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE "tasks"
      SET "updatedAt" = "createdAt"
      WHERE "updatedAt" IS NULL;
    `);
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("tasks");

    if (table.updatedAt) {
      await queryInterface.removeColumn("tasks", "updatedAt");
    }

    if (table.createdAt) {
      await queryInterface.removeColumn("tasks", "createdAt");
    }
  },
};