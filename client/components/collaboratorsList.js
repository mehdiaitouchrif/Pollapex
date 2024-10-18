import { FaTrash } from "react-icons/fa";

const CollaboratorItem = ({ collaborator, isOwner, onDelete, isPending }) => (
  <div className="flex items-center justify-between py-2 my-2 border-b border-b-gray-100 last:border-b-transparent">
    <div className="mr-2">
      <h4 className="font-semibold text-gray-900">{collaborator.name}</h4>
      <p className="text-gray-400 text-sm">
        <strong>Email: </strong> {collaborator.email}
      </p>
      {isPending && (
        <div className="bg-blue-500 text-white font-medium p-1 rounded-lg text-sm shadow-sm mt-3 w-fit">
          Pending
        </div>
      )}
    </div>

    {isOwner && (
      <button
        onClick={() => onDelete(collaborator._id)}
        className="inline-block rounded-lg shadow py-3 px-4 border bg-red-50 border-red-100 hover:bg-red-100 duration-150 ease-in-out"
      >
        <FaTrash size={18} className="text-red-400" />
      </button>
    )}
  </div>
);

const CollaboratorsList = ({
  collaborators,
  pendingCollabs,
  isOwner,
  onDelete,
}) => {
  if (collaborators.length === 0 && pendingCollabs.length === 0) {
    return (
      <h2 className="mt-6 text-xl">
        You have no collaborators on this survey yet.
      </h2>
    );
  }

  return (
    <>
      {collaborators.length > 0 && (
        <div className="px-4 py-2 my-4 rounded-lg bg-white shadow">
          {collaborators.map((collaborator) => (
            <CollaboratorItem
              key={collaborator._id}
              collaborator={collaborator}
              isOwner={isOwner}
              onDelete={onDelete}
              isPending={false}
            />
          ))}
        </div>
      )}

      {pendingCollabs.length > 0 && (
        <div className="px-4 py-2 my-4 rounded-lg bg-white shadow">
          {pendingCollabs.map((collaborator) => (
            <CollaboratorItem
              key={collaborator._id}
              collaborator={collaborator}
              isOwner={isOwner}
              onDelete={onDelete}
              isPending={true}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CollaboratorsList;
