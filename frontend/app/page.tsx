import PageBuilder from '@/app/components/PageBuilder'
import {homepageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Page() {
  const {data: page} = await sanityFetch({
    query: homepageQuery,
  })

  if (!page) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-[36px] mb-4">Welcome to Hound Around Resort</h1>
        <p className="font-sans text-text-muted text-[18px]">
          No homepage has been created yet. Create a page in Sanity Studio with slug
          &ldquo;homepage&rdquo; and add sections to the page builder.
        </p>
      </div>
    )
  }

  return <PageBuilder page={page} />
}
