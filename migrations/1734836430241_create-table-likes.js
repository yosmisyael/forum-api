/* eslint-disable camelcase */
exports.up = pgm => {
    pgm.createTable("likes", {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'comments',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('likes');
};
