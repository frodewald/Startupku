import { auth } from "@/auth";
import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ query?: string }>
}) {
  const query = (await searchParams).query || '';
  const params = {search: query || null };

  const session = await auth();

  const { data: posts } = await sanityFetch({ 
    query: STARTUPS_QUERY, 
    params,
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Perkenalkan Startup Anda, <br /> Terhubung dengan Para Pengusaha</h1>
        <p className="sub-heading !max-w-3xl">
          Kirimkan Ide Anda, dan Dapatkan Perhatian Mata Investor.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Hasil pencarian dari "${query}"` : 'Semua Startup'}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
