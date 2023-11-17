import PlusIcon from "@heroicons/react/20/solid/PlusIcon";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import { useRouter } from "next/navigation";

export default function EmptyState() {
  const router = useRouter();

  const takeToFeed = () => {
    router.push("/home");
  };

  return (
    <div className="mt-40 text-center">
      <HeartIcon
        className="mx-auto h-12 w-12 text-gray-400"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      />
      <h3 className="mt-2 text-xl font-semibold text-gray-900">No favorites</h3>
      <p className="mt-1 text-gray-500">Get started</p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-[#0070F3] px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          onClick={takeToFeed}
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          View chords
        </button>
      </div>
    </div>
  );
}
