/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        },
        date: {
            type: 'TEXT',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('replies', 'fk_replies.comment_id_comments.id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'CASCADE',
        },
    });

    pgm.addConstraint('replies', 'fk_replies.owner_users.id', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropConstraint('replies', 'fk_replies.comment_id_comments.id');
    pgm.dropConstraint('replies', 'fk_replies.owner_users.id');
    pgm.dropTable('replies');
};