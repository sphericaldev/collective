import { Transaction } from "sequelize";
import { Event, Comment, User } from "@server/models";

type Props = {
  /** The user destroying the comment */
  user: User;
  /** The comment to destroy */
  comment: Comment;
  /** The IP address of the user */
  ip: string;
  transaction?: Transaction;
};

/**
 * This command destroys a document comment. This just removes the comment itself and
 * does not touch the document
 *
 * @param Props The properties of the comment to destroy
 * @returns void
 */
export default async function commentDestroyer({
  user,
  comment,
  ip,
  transaction,
}: Props): Promise<Comment> {
  await Event.create(
    {
      name: "comments.delete",
      modelId: comment.id,
      teamId: user.teamId,
      actorId: user.id,
      documentId: comment.documentId,
      ip,
    },
    { transaction }
  );

  await comment.destroy({ transaction });

  return comment;
}
