# Star-wayback-worker

某きらきらなファンタジーゲームのお知らせページをWaybackMachineから探し出し、存在すればリダイレクトを返すCloudflare Worker。
このゲームはなぜかお知らせページのドメインが2つあり、どっちにあったかわからなくなりがちなため、両ドメインに問い合わせる仕様で実装されている。
WaybackMachineにご迷惑なため、2時間はキャッシュする仕様。

## 実行方法

- 1. このリポジトリをCloneしてくる
- 2. npm install する
- 3. `wrangler login` して Cloudflareにログインする
- 4. `wrangler deploy` で Cloudflare workersにデプロイする
- 5. 任意のドメインに割り当ててあとは楽しむ

## ライセンス
MIT