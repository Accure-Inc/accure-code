<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | <a href="README.ar.md">العربية</a> | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | Türkçe | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">VS Code, JetBrains veya CLI'de AI ile geliştirme yapmak için açık kaynak kodlama ajanı.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code, çalıştığınız her yerde size eşlik eden bir AI kodlama ajanıdır: [VS Code](https://accure.ai/landing/vs-code), [JetBrains](https://accure.ai/features/jetbrains-native) ve [CLI](https://accure.ai/cli). Açık kaynaktır ve açık fiyatlandırma sunar. 500'den fazla model arasından seçim yapabilir, görev sırasında model değiştirebilir ve hiçbir ek ücret olmadan model sağlayıcısının fiyatını ödersiniz. Başlamak için API anahtarı gerekmez.

### Kurulum

Accure'yu nerede çalıştırmak istediğinizi seçin.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

[Accure Code uzantısını](vscode:extension/accurecode.accure-code) doğrudan kurun veya [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code) üzerinden edinin. Bir hesap oluşturduğunuzda GPT-5.5, Claude Opus 4.7, Claude Sonnet 4.6 ve Gemini 3.1 Pro Preview dahil 500'den fazla modele sağlayıcı fiyatıyla erişebilirsiniz.

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

Ardından başlamak için herhangi bir proje dizininde `accure` çalıştırın.

</details>

<details>
<summary><strong>JetBrains</strong></summary>

<br>

[Accure Code eklentisini](https://plugins.jetbrains.com/plugin/28350-accure-code) JetBrains Marketplace'ten kurun veya herhangi bir JetBrains IDE içinde `Settings → Plugins` bölümünde "Accure Code" arayın.

</details>

<details>
<summary><strong>Cloud Agent</strong></summary>

<br>

Accure'yu yerel makine gerekmeden web üzerinden [app.accure.ai/cloud](https://app.accure.ai/cloud) adresinde çalıştırın.

</details>

<details>
<summary><strong>Kod İncelemeleri</strong></summary>

<br>

Pull request'leriniz için otomatik AI kod incelemelerini [app.accure.ai/code-reviews](https://app.accure.ai/code-reviews) adresinde ayarlayın.

</details>

<details>
<summary><strong>AccureClaw</strong></summary>

<br>

Her zaman açık AI ajanınızı [app.accure.ai/claw](https://app.accure.ai/claw) adresinde başlatın.

</details>

<details>
<summary>CLI'yi GitHub Releases üzerinden kurun (ikili dosyalar)</summary>

En son ikili dosyayı [Releases sayfasından](https://github.com/Accure-Org/accurecode/releases) indirin.

| Platform | Asset |
|---|---|
| Windows (çoğu PC) | `accure-windows-x64.zip` |
| macOS (Apple Silicon) | `accure-darwin-arm64.zip` |
| macOS (Intel) | `accure-darwin-x64.zip` |
| Linux x64 | `accure-linux-x64.tar.gz` |
| Linux ARM | `accure-linux-arm64.tar.gz` |

Notlar: `x64-baseline`, AVX olmayan eski CPU'lar için uyumluluk derlemesidir. `musl`, Alpine veya glibc olmayan minimal Docker imajları için statik bağlı derlemedir. `accure-vscode-*.vsix` CLI değil VS Code uzantı paketidir. `Source code` arşivleri kaynaktan derlemek içindir.

</details>

### Agents

Accure, göreve göre aralarında geçiş yapabileceğiniz özelleşmiş agents ile gelir. Kendi özel agents'larınızı da oluşturabilirsiniz.

- **Code** - Varsayılan. Doğal dilden kod uygular ve düzenler.
- **Plan** - Kod yazılmadan önce mimari tasarlar ve uygulama planları yazar.
- **Ask** - Dosyalara dokunmadan kod tabanınız hakkında soruları yanıtlar.
- **Debug** - Sorunları giderir ve izler.
- **Review** - Değişikliklerinizi inceler ve performans, güvenlik, stil ve test kapsamı sorunlarını ortaya çıkarır.

[Agents ve özel agents](https://accure.ai/docs/code-with-ai/agents/using-agents) hakkında daha fazla bilgi edinin.

### Ne yapar

- Birden çok dosyada doğal dilden **kod üretimi**.
- Ghost-text önerileri ve kabul etmek için Tab ile **satır içi otomatik tamamlama**.
- Ajanın kendi çalışmasını inceleyip düzeltmesi için **öz denetim**.
- Komut çalıştırmak ve web'i otomatikleştirmek için **terminal ve tarayıcı kontrolü**.
- Ajanın yapabileceklerini genişleten MCP sunucularını bulmak ve bağlamak için **MCP marketplace**.
- Gecikme, maliyet ve akıl yürütmeyi işe uygun seçmek için görev sırasında geçiş destekli **500'den fazla model**.

### Otonom Mod (CI/CD)

CI/CD pipeline'ları için prompts olmadan tamamen otonom çalıştırmak üzere `accure run` komutunu `--auto` ile çalıştırın:

```bash
accure run --auto "run tests and fix any failures"
```

`--auto` tüm izin istemlerini devre dışı bırakır ve ajanın herhangi bir işlemi onay olmadan yürütmesine izin verir. Yalnızca güvenilir ortamlarda kullanın.

### Dokümantasyon

Yapılandırma ve diğer her şey için [dokümantasyona](https://accure.ai/docs) bakın.

### Katkıda bulunma

Geliştiricilerden, yazarlardan ve herkesten katkı bekliyoruz. Ortam kurulumu, kodlama standartları ve pull request açma hakkında bilgi için [Contributing Guide](/CONTRIBUTING.md) ile başlayın. VS Code uzantısı ve CLI yayın süreci için [RELEASING.md](RELEASING.md), JetBrains eklentisi için [packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) dosyasına bakın.

Katılmadan önce lütfen [Code of Conduct](/CODE_OF_CONDUCT.md) belgemizi okuyun.

### Lisans

MIT. Atıf ve lisans bildirimlerini koruduğunuz sürece bu kodu ticari olarak da kullanabilir, değiştirebilir ve dağıtabilirsiniz. Bkz. [License](/LICENSE).

### FAQ

<details>
<summary>Accure CLI nereden geldi?</summary>

Accure CLI, Accure agentic engineering platformunda çalışacak şekilde geliştirilmiş bir [OpenCode](https://github.com/Accure-Org/accurecode) fork'udur.

</details>

---

**Topluluğa katılın** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)
