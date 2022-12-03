resource "aws_lb_target_group" "this" {
  name        = format("lb-tg-%s", var.project_name)
  port        = var.ecs.container_port
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.this.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "60"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "5"
    path                = var.ecs.healthcheck_path
    unhealthy_threshold = "2"
  }

  tags = merge(
    local.default_tags,
    { Name = format("alb-tg-%s", var.context) }
  )
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = data.aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = data.aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = data.aws_acm_certificate.this.arn

  default_action {
    target_group_arn = aws_lb_target_group.this.arn
    type             = "forward"
  }
}
