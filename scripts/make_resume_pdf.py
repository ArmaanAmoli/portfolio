"""Generate a minimal, valid PDF resume from the portfolio data.

The reference resume PDF was not present in this repository, so this script
produces a placeholder PDF containing only the facts listed in the portfolio
data file. Replace `public/Armaan_Resume.pdf` with the real resume when it is
available.
"""

from pathlib import Path

LINES = [
    "Armaan Amoli",
    "CS undergraduate - building products and AI agents",
    "Bhopal, India",
    "armaanmohanamoli@gmail.com",
    "github.com/ArmaanAmoli",
    "linkedin.com/in/armaan-amoli",
    "",
    "PROJECTS",
    "BabyPanda: Autonomous AI Coding Agent",
    "TypeScript/Bun monorepo for an autonomous terminal-based coding assistant",
    "that uses streaming LLM responses to inspect repositories, modify files,",
    "execute shell commands, search the web, and maintain project-specific memory.",
    "github.com/ArmaanAmoli/BabyPanda",
    "",
    "Paper Trading App: Full-Stack Market Simulator",
    "Full-stack paper-trading platform simulating stock-market investing with live",
    "market data, technical analysis, trade execution, watchlists, and portfolio",
    "tracking.",
    "github.com/ArmaanAmoli/Paper-Trading-App",
    "",
    "EDUCATION",
    "Lakshmi Narain College of Technology (RGPV), Bhopal",
    "B.Tech, Computer Science (AI and Data Science), 2024-2028, 5th semester",
    "CGPA 8.55",
    "St. Joseph Co-Ed School (CBSE), Kolar Road, Bhopal",
    "Class XII: 91.2% (2023-2024). Class X: 91.1% (2021-2022).",
    "",
    "COMPETITIVE PROGRAMMING",
    "LeetCode: 400+ problems solved",
    "Codeforces: 40+ problems solved",
    "",
    "SKILLS",
    "Languages: TypeScript, Python, C++",
    "Frontend: React, React Ink, Vite, Next.js",
    "Backend: Node.js, Hono, Express, FastAPI, REST APIs, WebSockets, SSE",
    "Databases / ORM: SQLite, Drizzle ORM, MongoDB",
    "Agent / AI Tooling: MCP, LLM streaming, tool-calling agent design",
    "Tools: Git, Bun, npm, Zod",
    "",
    "NOTE: generated placeholder - replace with the original resume PDF.",
]


def escape(text: str) -> str:
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def build_pdf(lines: list[str]) -> bytes:
    content_lines = ['BT', '/F1 10 Tf', '12 TL', '50 780 Td']
    for index, line in enumerate(lines):
        if index:
            content_lines.append('T*')
        if line:
            content_lines.append(f'({escape(line)}) Tj')
    content_lines.append('ET')
    stream = '\n'.join(content_lines).encode('latin-1')

    objects = [
        b'<< /Type /Catalog /Pages 2 0 R >>',
        b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] '
        b'/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
        b'<< /Length ' + str(len(stream)).encode() + b' >>\nstream\n' + stream + b'\nendstream',
        b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ]

    out = bytearray(b'%PDF-1.4\n')
    offsets = []
    for number, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f'{number} 0 obj\n'.encode() + body + b'\nendobj\n'

    xref_offset = len(out)
    out += f'xref\n0 {len(objects) + 1}\n'.encode()
    out += b'0000000000 65535 f \n'
    for offset in offsets:
        out += f'{offset:010d} 00000 n \n'.encode()
    out += f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n'.encode()
    out += f'startxref\n{xref_offset}\n%%EOF\n'.encode()
    return bytes(out)


if __name__ == '__main__':
    target = Path(__file__).resolve().parent.parent / 'public' / 'Armaan_Resume.pdf'
    target.write_bytes(build_pdf(LINES))
    print(f'wrote {target} ({target.stat().st_size} bytes)')
