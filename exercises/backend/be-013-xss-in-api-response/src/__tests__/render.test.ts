import { escapeHtml, renderUserCard, renderSearchResults } from "../render";

describe("XSS Prevention", () => {
  describe("escapeHtml", () => {
    it("escapes < and > characters", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
      );
    });

    it("escapes & character", () => {
      expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
    });

    it("escapes double quotes", () => {
      expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
    });

    it("escapes single quotes", () => {
      expect(escapeHtml("it's")).toBe("it&#39;s");
    });

    it("escapes all special characters together", () => {
      expect(escapeHtml('<a href="x" onclick=\'alert(&)\'>'))
        .toBe("&lt;a href=&quot;x&quot; onclick=&#39;alert(&amp;)&#39;&gt;");
    });

    it("returns empty string unchanged", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("returns safe strings unchanged", () => {
      expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
    });
  });

  describe("renderUserCard", () => {
    it("renders safe user data correctly", () => {
      const html = renderUserCard({
        name: "Alice",
        bio: "Developer",
        website: "https://alice.dev",
      });
      expect(html).toContain("Alice");
      expect(html).toContain("Developer");
      expect(html).toContain("https://alice.dev");
    });

    it("escapes script tags in user name", () => {
      const html = renderUserCard({
        name: '<script>alert("xss")</script>',
        bio: "Normal bio",
        website: "https://example.com",
      });
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });

    it("escapes HTML in bio field", () => {
      const html = renderUserCard({
        name: "Alice",
        bio: '<img src=x onerror="alert(1)">',
        website: "https://example.com",
      });
      expect(html).not.toContain("<img");
      expect(html).toContain("&lt;img");
    });

    it("escapes malicious website URL", () => {
      const html = renderUserCard({
        name: "Alice",
        bio: "Developer",
        website: '" onclick="alert(1)" data-x="',
      });
      expect(html).not.toContain('onclick="alert(1)"');
      expect(html).toContain("&quot;");
    });

    it("handles all fields containing malicious input simultaneously", () => {
      const html = renderUserCard({
        name: "<b>Bold</b>",
        bio: "A & B < C",
        website: 'https://x.com?a=1&b=2"',
      });
      expect(html).not.toContain("<b>");
      expect(html).toContain("&lt;b&gt;");
      expect(html).toContain("A &amp; B &lt; C");
    });
  });

  describe("renderSearchResults", () => {
    it("renders empty results message", () => {
      const html = renderSearchResults([]);
      expect(html).toBe("<p>No results found.</p>");
    });

    it("renders safe search results correctly", () => {
      const html = renderSearchResults([
        { title: "Result 1", snippet: "Some text", query: "search term" },
      ]);
      expect(html).toContain("Result 1");
      expect(html).toContain("Some text");
      expect(html).toContain("search term");
    });

    it("escapes malicious search query", () => {
      const html = renderSearchResults([
        {
          title: "Result",
          snippet: "Text",
          query: '<script>document.cookie</script>',
        },
      ]);
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });

    it("escapes malicious content in title and snippet", () => {
      const html = renderSearchResults([
        {
          title: '<img src=x onerror="steal()">',
          snippet: '<a href="javascript:alert(1)">click</a>',
          query: "safe query",
        },
      ]);
      expect(html).not.toContain("<img");
      expect(html).not.toContain("<a href");
      expect(html).toContain("&lt;img");
      expect(html).toContain("&lt;a href");
    });
  });
});
