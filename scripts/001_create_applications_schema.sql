-- Mialab B2B Application Schema

-- Applications table (main record)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'draft',
  practice_name TEXT NOT NULL,
  dba_name TEXT,
  doctor_owner_name TEXT NOT NULL,
  primary_contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  business_type TEXT NOT NULL,
  years_in_business TEXT NOT NULL,
  is_owner_principal TEXT NOT NULL,
  billing_address_1 TEXT NOT NULL,
  billing_address_2 TEXT,
  billing_city TEXT NOT NULL,
  billing_state TEXT NOT NULL,
  billing_zip TEXT NOT NULL,
  ap_contact_name TEXT NOT NULL,
  ap_email TEXT NOT NULL,
  monthly_statement_email_preference TEXT NOT NULL DEFAULT 'yes',
  shipping_same_as_billing BOOLEAN NOT NULL DEFAULT true,
  shipping_address_1 TEXT,
  shipping_address_2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  tax_id TEXT NOT NULL,
  number_of_locations TEXT NOT NULL,
  monthly_lab_volume TEXT NOT NULL,
  weekly_exams TEXT NOT NULL,
  edge_lenses_in_house TEXT NOT NULL,
  lab_orders_manager TEXT NOT NULL,
  lab_orders_contact_name TEXT,
  lab_orders_contact_email TEXT,
  plan_to_begin_sending TEXT NOT NULL,
  main_reason TEXT NOT NULL,
  ordering_method TEXT NOT NULL,
  other_ordering_method TEXT,
  has_resale_certificate TEXT NOT NULL,
  resale_certificate_blob_path TEXT,
  apply_for_credit TEXT NOT NULL,
  requested_credit_amount TEXT,
  payment_method TEXT NOT NULL,
  certify_true_accurate BOOLEAN NOT NULL DEFAULT false,
  authorize_credit_check BOOLEAN NOT NULL DEFAULT false,
  acknowledge_processing_fee BOOLEAN NOT NULL DEFAULT false,
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  signature_type TEXT,
  signature_data TEXT,
  printed_name TEXT,
  signer_title TEXT,
  signature_date TEXT,
  signed_pdf_blob_path TEXT,
  agreement_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ
);

-- Application audit trail table
CREATE TABLE IF NOT EXISTS public.application_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  action_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Application documents table
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  original_filename TEXT,
  blob_path TEXT NOT NULL,
  content_type TEXT,
  file_size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_audit_trail_application_id ON public.application_audit_trail(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON public.application_documents(application_id);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service role access
CREATE POLICY "Service role full access applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access audit" ON public.application_audit_trail FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access documents" ON public.application_documents FOR ALL USING (true) WITH CHECK (true);
