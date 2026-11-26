import { SERVER_URL } from "../api";
import "./NewsList.css";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// First item is the lead story; the rest render as a compact list.
export default function NewsList({ items, showCaption = false, headingLevel = 2 }) {
  const LeadHeading = `h${headingLevel}`;
  const ItemHeading = `h${headingLevel + 1}`;
  if (items.length === 0) return <p className="status">Belum ada berita.</p>;
  const [lead, ...rest] = items;

  return (
    <div className="news-layout">
      <article className="news-lead card">
        {lead.image_url && <img src={`${SERVER_URL}${lead.image_url}`} alt="" />}
        <div className="news-lead-body">
          <LeadHeading className="news-lead-title">{lead.title}</LeadHeading>
          {lead.caption && <p>{lead.caption}</p>}
          <time dateTime={lead.published_at}>{formatDate(lead.published_at)}</time>
        </div>
      </article>

      {rest.length > 0 && (
        <ul className="news-items card">
          {rest.map((n) => (
            <li key={n.id} className="news-item">
              {n.image_url && <img src={`${SERVER_URL}${n.image_url}`} alt="" />}
              <div>
                <ItemHeading className="news-item-title">{n.title}</ItemHeading>
                {showCaption && n.caption && <p>{n.caption}</p>}
                <time dateTime={n.published_at}>{formatDate(n.published_at)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
