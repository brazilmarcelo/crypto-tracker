# Alertas WhatsApp - Troubleshooting

## Problema
Usuários não estavam recebendos alertas mesmo tendo:
- Número de WhatsApp cadastrado
- Alertas ativos configurados
- Transações novas nas wallets

## Causa Raiz
O cron job em `src/app/api/cron/check/route.ts` tinha uma condição restritiva:
```typescript
where: { 
  phone: { not: null },
  phoneVerified: true  // <-- problema aqui
}
```

O campo `phoneVerified` era definido como `false` ao salvar o número (em `src/app/api/user/phone/route.ts`), e nunca era alterado para `true` - não havia fluxo de verificação.

## Solução
Alterar a condição no cron para permitir usuários com telefone cadastrado (independentemente do status de verificação):
```typescript
phoneVerified: false
```

Isso permite que alertas sejam enviados para qualquer usuário que tenha cadastrado seu número de WhatsApp.

## Alternativas Futuras
1. Implementar fluxo de verificação de número via SMS/WhatsApp
2. Adicionar campo `notificationsEnabled` para controle granular
3. Criar sistema de Opt-in/Opt-out

## Logs de Debug
Para debugar problemas futuros, o cron inclui logs detalhados:
- `Users found with phoneVerified:` - número de usuários com telefone
- `Wallet: X alerts: Y` - wallets com alertas configurados
- `txs in API, new txs` - transações encontradas vs novas
- `Alert match: true/false` - se transação匹配alerta
- `WhatsApp send result: true/false` - resultado do envio

---

**Data**: 2026-04-19