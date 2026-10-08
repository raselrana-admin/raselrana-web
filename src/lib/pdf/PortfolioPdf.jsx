import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// The portfolio as a PDF (A4). Shows the same data as the /portfolio page:
// `portfolio` comes from buildPortfolio() in lib/portfolio.js.
//
// Uses the PDF format's built-in Helvetica, so no font files are needed.
// Helvetica covers English and other Latin text only; Bangla would not render.

const INK = "#0f2438";
const SLATE = "#5b6b7a";
const SIGNAL = "#0e7c86";
const LINE = "#d8dde1";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: INK,
  },
  name: { fontFamily: "Helvetica-Bold", fontSize: 26, lineHeight: 1.15 },
  role: { marginTop: 6, fontSize: 11, color: SLATE },
  contacts: { marginTop: 10, fontSize: 9, color: SLATE },
  rule: { marginTop: 18, borderBottomWidth: 1, borderBottomColor: LINE },
  block: { marginTop: 18 },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: SIGNAL,
  },
  summary: { marginTop: 8, color: INK },
  item: { marginTop: 12 },
  itemHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  itemTitle: { flex: 1, paddingRight: 12, fontFamily: "Helvetica-Bold", fontSize: 11 },
  period: { fontSize: 9, color: SLATE },
  subtitle: { marginTop: 1, color: SIGNAL },
  description: { marginTop: 4, color: SLATE },
  point: { flexDirection: "row", marginTop: 3 },
  bullet: { width: 12, color: SIGNAL },
  pointText: { flex: 1, color: SLATE },
  // Repeated at the bottom of every page (the `fixed` Text). Page numbers are
  // left out: the library's dynamic `render` text did not print in this setup.
  footer: { position: "absolute", bottom: 26, left: 52, right: 52, fontSize: 8, color: SLATE },
});

export default function PortfolioPdf({ portfolio, updated }) {
  const { header, summaries, sections } = portfolio;

  return (
    <Document title={`${header.name} — Portfolio`} author={header.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{header.name}</Text>
        <Text style={styles.role}>
          {[header.role, header.org].filter(Boolean).join("  ·  ")}
        </Text>
        {header.contacts.length > 0 && (
          <Text style={styles.contacts}>{header.contacts.join("   ·   ")}</Text>
        )}
        <View style={styles.rule} />

        {summaries.map((block) => (
          <View key={block.id} style={styles.block}>
            <Text style={styles.heading}>{block.heading}</Text>
            <Text style={styles.summary}>{block.text}</Text>
          </View>
        ))}

        {sections.map((section) => (
          <View key={section.name} style={styles.block}>
            {section.items.map((item, index) => (
              // wrap={false} keeps an item on one page. The section heading
              // is drawn inside the first item, so it can never be left
              // alone at the bottom of a page.
              <View key={item.id} wrap={false}>
                {index === 0 && <Text style={styles.heading}>{section.name}</Text>}
                <View style={styles.item}>
                  <View style={styles.itemHead}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {item.period ? <Text style={styles.period}>{item.period}</Text> : null}
                  </View>
                  {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
                  {item.description ? (
                    <Text style={styles.description}>{item.description}</Text>
                  ) : null}
                  {(item.points ?? []).map((point) => (
                    <View key={point} style={styles.point}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.pointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.footer} fixed>
          {updated ? `${header.name}  ·  Updated ${updated}` : header.name}
        </Text>
      </Page>
    </Document>
  );
}
