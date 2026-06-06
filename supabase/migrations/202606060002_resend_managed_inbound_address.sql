-- Align the MVP rate-intelligence forwarding address with the Resend-managed inbound domain.
-- Resend accepts any local-part at luniaontua.resend.app; rates@ is the standard address.

alter table if exists public.lender_email_sources
  alter column forwarding_address set default 'rates@luniaontua.resend.app';

update public.lender_email_sources
set forwarding_address = 'rates@luniaontua.resend.app'
where forwarding_address in ('rates@ontariomortgagerateportal.ca', 'lender-rates@sicapital.ca');
