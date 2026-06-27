<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | ไทย | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">เอเจนต์เขียนโค้ดโอเพนซอร์สสำหรับสร้างด้วย AI ใน VS Code, JetBrains หรือ CLI</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code คือเอเจนต์เขียนโค้ดด้วย AI ที่ทำงานได้ทุกที่ที่คุณทำงาน: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) และ [CLI](https://accure.ai/cli) เป็นโอเพนซอร์สและมีราคาที่โปร่งใส คุณเลือกได้จากโมเดลมากกว่า 500 รายการ สลับโมเดลระหว่างทำงาน และจ่ายตามราคาของผู้ให้บริการโมเดลโดยไม่มีส่วนเพิ่ม ไม่ต้องใช้ API key เพื่อเริ่มต้น

### การติดตั้ง

เลือกตำแหน่งที่คุณต้องการใช้งาน Accure

<details open>
<summary><strong>VS Code</strong></summary>

<br>

ติดตั้ง [ส่วนขยาย Accure Code](vscode:extension/accurecode.accure-code) โดยตรง หรือดาวน์โหลดจาก [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code) สร้างบัญชีแล้วคุณจะเข้าถึงโมเดลมากกว่า 500 รายการ รวมถึง GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 และ Gemini 3.1 Pro Preview ทั้งหมดในราคาผู้ให้บริการ

</details>

<details open>
<summary><strong>CLI</strong></summary>

<br>

```bash
# npm
npm install -g @accurecode/cli

# curl
curl -fsSL https://accure.ai/cli/install | bash

# pnpm
pnpm add -g @accurecode/cli

# bun
bun add -g @accurecode/cli

# Homebrew (macOS / Linux)
brew install Accure-Org/tap/accure

# Arch Linux (AUR)
paru -S accure-bin
```

จากนั้นรัน `accure` ในไดเรกทอรีโปรเจกต์ใดก็ได้เพื่อเริ่มต้น

</details>

<details>
<summary><strong>JetBrains</strong></summary>

<br>

ติดตั้ง [ปลั๊กอิน Accure Code](https://plugins.jetbrains.com/plugin/28350-accure-code) จาก JetBrains Marketplace หรือค้นหา "Accure Code" ใน `Settings → Plugins` ภายใน JetBrains IDE ใดก็ได้

</details>

<details>
<summary><strong>Cloud Agent</strong></summary>

<br>

รัน Accure จากเว็บโดยไม่ต้องใช้เครื่องภายในที่ [app.accure.ai/cloud](https://app.accure.ai/cloud)

</details>

<details>
<summary><strong>Code Reviews</strong></summary>

<br>

ตั้งค่าการรีวิวโค้ดด้วย AI อัตโนมัติบน pull request ของคุณที่ [app.accure.ai/code-reviews](https://app.accure.ai/code-reviews)

</details>

<details>
<summary><strong>AccureClaw</strong></summary>

<br>

เริ่มเอเจนต์ AI ที่ทำงานตลอดเวลาของคุณที่ [app.accure.ai/claw](https://app.accure.ai/claw)

</details>

<details>
<summary>ติดตั้ง CLI จาก GitHub Releases (ไบนารี)</summary>

ดาวน์โหลดไบนารีล่าสุดจาก [หน้า Releases](https://github.com/Accure-Org/accurecode/releases)

| แพลตฟอร์ม | Asset |
|---|---|
| Windows (พีซีส่วนใหญ่) | `accure-windows-x64.zip` |
| macOS (Apple Silicon) | `accure-darwin-arm64.zip` |
| macOS (Intel) | `accure-darwin-x64.zip` |
| Linux x64 | `accure-linux-x64.tar.gz` |
| Linux ARM | `accure-linux-arm64.tar.gz` |

หมายเหตุ: `x64-baseline` คือ build ที่เข้ากันได้สำหรับ CPU รุ่นเก่าที่ไม่มี AVX ส่วน `musl` คือ build แบบ static link สำหรับ Alpine หรือ Docker image ขั้นต่ำที่ไม่มี glibc `accure-vscode-*.vsix` คือแพ็กเกจส่วนขยาย VS Code ไม่ใช่ CLI ไฟล์ `Source code` ใช้สำหรับ build จากซอร์ส

</details>

### Agents

Accure มาพร้อม agents เฉพาะทางที่คุณสลับได้ตามงาน คุณยังสร้าง agents แบบกำหนดเองได้ด้วย

- **Code** - ค่าเริ่มต้น ใช้ภาษาธรรมชาติในการเขียนและแก้ไขโค้ด
- **Plan** - ออกแบบสถาปัตยกรรมและเขียนแผนการทำงานก่อนมีการเขียนโค้ด
- **Ask** - ตอบคำถามเกี่ยวกับ codebase โดยไม่แตะไฟล์
- **Debug** - แก้ไขและติดตามปัญหา
- **Review** - รีวิวการเปลี่ยนแปลงและค้นหาปัญหาด้านประสิทธิภาพ ความปลอดภัย สไตล์ และ test coverage

เรียนรู้เพิ่มเติมเกี่ยวกับ [agents และ agents แบบกำหนดเอง](https://accure.ai/docs/code-with-ai/agents/using-agents)

### ทำอะไรได้บ้าง

- **สร้างโค้ด** จากภาษาธรรมชาติข้ามหลายไฟล์
- **เติมโค้ดอัตโนมัติแบบ inline** พร้อมคำแนะนำ ghost-text และกด Tab เพื่อรับ
- **ตรวจสอบตัวเอง** เพื่อให้เอเจนต์รีวิวและแก้งานของตนเอง
- **ควบคุม terminal และ browser** เพื่อรันคำสั่งและทำงานบนเว็บอัตโนมัติ
- **MCP marketplace** เพื่อค้นหาและเชื่อมต่อ MCP server ที่ขยายความสามารถของเอเจนต์
- **โมเดลมากกว่า 500 รายการ** พร้อมการสลับระหว่างงาน เพื่อให้เหมาะกับ latency, cost และ reasoning ของงาน

### โหมดอัตโนมัติ (CI/CD)

รัน `accure run` พร้อม `--auto` เพื่อทำงานอัตโนมัติเต็มรูปแบบโดยไม่มี prompts เหมาะสำหรับ CI/CD pipelines:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` ปิด prompt สิทธิ์ทั้งหมดและให้เอเจนต์ดำเนินการใดก็ได้โดยไม่ต้องยืนยัน ใช้เฉพาะในสภาพแวดล้อมที่เชื่อถือได้เท่านั้น

### เอกสาร

สำหรับการตั้งค่าและเรื่องอื่น ๆ ดูที่ [เอกสาร](https://accure.ai/docs)

### การมีส่วนร่วม

ยินดีรับการมีส่วนร่วมจากนักพัฒนา นักเขียน และทุกคน เริ่มจาก [Contributing Guide](/CONTRIBUTING.md) สำหรับการตั้งค่าสภาพแวดล้อม มาตรฐานโค้ด และวิธีเปิด pull request ดู [RELEASING.md](RELEASING.md) สำหรับกระบวนการ release ของส่วนขยาย VS Code และ CLI และ [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) สำหรับปลั๊กอิน JetBrains

โปรดอ่าน [Code of Conduct](/CODE_OF_CONDUCT.md) ก่อนเข้าร่วม

### License

MIT คุณสามารถใช้ แก้ไข และแจกจ่ายโค้ดนี้ รวมถึงเชิงพาณิชย์ ตราบใดที่ยังเก็บ attribution และประกาศ license ไว้ ดู [License](/LICENSE)

### FAQ

<details>
<summary>Accure CLI มาจากไหน?</summary>

Accure CLI เป็น fork ของ [OpenCode](https://github.com/Accure-Org/accurecode) ที่ได้รับการปรับปรุงให้ทำงานในแพลตฟอร์ม Accure agentic engineering

</details>

---

**เข้าร่วมชุมชน** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
