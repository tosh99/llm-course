import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router"
import { SEO, SITE_URL } from "@/lib/seo"

export function Seo() {
    const { pathname } = useLocation()
    const meta = SEO[pathname]

    if (!meta) {
        return (
            <Helmet>
                <title>DeepLearn</title>
            </Helmet>
        )
    }

    return (
        <Helmet>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <link rel="canonical" href={`${SITE_URL}${pathname}`} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${SITE_URL}${pathname}`} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="theme-color" content="#0d0d10" />
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Course",
                    "name": "DeepLearn — ML → LLM Course",
                    "description": meta.description,
                    "provider": {
                        "@type": "Organization",
                        "name": "DeepLearn"
                    },
                    "educationalLevel": "Self-study",
                    "inLanguage": "en"
                })}
            </script>
        </Helmet>
    )
}